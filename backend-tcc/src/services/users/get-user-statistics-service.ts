import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../../db/client.ts";
import {
  flashcard_reviews,
  flashcards,
  materials,
  quiz_attempts,
  quizzes,
} from "../../db/schema.ts";

type GetUserStatisticsRequest = {
  userId: string;
};

type RecentActivity = {
  date: string;
  flashcards_reviewed: number;
  quizzes_completed: number;
  study_time_minutes: number;
};

type UpcomingReviewMaterial = {
  material_id: string;
  material_title: string;
  flashcards_count: number;
};

type UpcomingReview = {
  date: string;
  flashcards_due: number;
  materials: UpcomingReviewMaterial[];
};

type GetUserStatisticsResponse = {
  total_materials: number;
  total_flashcards: number;
  total_quizzes: number;
  flashcards_reviewed_today: number;
  quizzes_completed_today: number;
  total_study_days: number;
  current_streak: number;
  flashcard_stats: {
    total_reviews: number;
    average_quality: number;
    mastered_count: number;
    learning_count: number;
    new_count: number;
    difficulty_distribution: {
      again: number;
      hard: number;
      good: number;
      easy: number;
    };
  };
  quiz_stats: {
    total_attempts: number;
    correct_attempts: number;
    accuracy_percentage: number;
    average_time_per_quiz: number;
  };
  recent_activity: RecentActivity[];
  upcoming_reviews: UpcomingReview[];
};

export class GetUserStatisticsService {
  async execute({
    userId,
  }: GetUserStatisticsRequest): Promise<GetUserStatisticsResponse> {
    // Calcular início e fim do dia de HOJE no timezone do Brasil (UTC-3)
    // Independente do timezone do servidor ou PostgreSQL
    const now = new Date();
    const brasilOffsetMs = -3 * 60 * 60 * 1000; // UTC-3 em milissegundos

    // Converter "agora" para o horário do Brasil
    const nowBrasil = new Date(now.getTime() + brasilOffsetMs);

    // Pegar apenas a data (sem hora) no Brasil
    const year = nowBrasil.getUTCFullYear();
    const month = nowBrasil.getUTCMonth();
    const day = nowBrasil.getUTCDate();

    // Criar início do dia no Brasil (00:00:00 BRT)
    const startOfDayBrasil = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    const startOfDayUTC = new Date(startOfDayBrasil.getTime() - brasilOffsetMs);

    // Criar fim do dia no Brasil (23:59:59.999 BRT)
    const endOfDayBrasil = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
    const endOfDayUTC = new Date(endOfDayBrasil.getTime() - brasilOffsetMs);

    const todayBrasil = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  
    // 1. Total de materiais do usuário
    const materialsCount = await db
      .select({ total: count() })
      .from(materials)
      .where(eq(materials.user_id, userId))
      .execute();
    const totalMaterials = materialsCount[0]?.total || 0;

    // 2. Total de flashcards do usuário
    const flashcardsCount = await db
      .select({ total: count() })
      .from(flashcards)
      .where(eq(flashcards.user_id, userId))
      .execute();
    const totalFlashcards = flashcardsCount[0]?.total || 0;

    // 3. Total de quizzes do usuário
    const quizzesCount = await db
      .select({ total: count() })
      .from(quizzes)
      .where(eq(quizzes.user_id, userId))
      .execute();
    const totalQuizzes = quizzesCount[0]?.total || 0;

    // 4. Flashcards revisados hoje (comparando com timestamps UTC calculados)
    const flashcardsToday = await db
      .select({ total: count() })
      .from(flashcard_reviews)
      .where(
        and(
          eq(flashcard_reviews.user_id, userId),
          gte(flashcard_reviews.reviewed_at, startOfDayUTC),
          lte(flashcard_reviews.reviewed_at, endOfDayUTC)
        )
      )
      .execute();
    const flashcardsReviewedToday = flashcardsToday[0]?.total || 0;

    // 5. Quizzes respondidos hoje (comparando com timestamps UTC calculados)
    const quizzesToday = await db
      .select({ total: count() })
      .from(quiz_attempts)
      .where(
        and(
          eq(quiz_attempts.user_id, userId),
          gte(quiz_attempts.attempted_at, startOfDayUTC),
          lte(quiz_attempts.attempted_at, endOfDayUTC)
        )
      )
      .execute();
    const quizzesCompletedToday = quizzesToday[0]?.total || 0;

    // 6. Total de dias únicos com atividade
    // Usar timezone América/São_Paulo para conversão correta
    const uniqueStudyDays = await db
      .selectDistinct({
        date: sql<string>`DATE(${flashcard_reviews.reviewed_at} AT TIME ZONE 'America/Sao_Paulo')`,
      })
      .from(flashcard_reviews)
      .where(eq(flashcard_reviews.user_id, userId))
      .execute();
    const totalStudyDays = uniqueStudyDays.length;

    // 7. Calcular streak (dias consecutivos)
    const currentStreak = await this.calculateStreak(userId, todayBrasil);

    // 8. Estatísticas detalhadas de flashcards
    const flashcardReviewsData = await db
      .select({ total: count() })
      .from(flashcard_reviews)
      .where(eq(flashcard_reviews.user_id, userId))
      .execute();
    const totalReviews = flashcardReviewsData[0]?.total || 0;

    // Distribuição de dificuldade
    const difficultyStats = await db
      .select({
        difficulty: flashcard_reviews.difficulty,
        count: count(),
      })
      .from(flashcard_reviews)
      .where(eq(flashcard_reviews.user_id, userId))
      .groupBy(flashcard_reviews.difficulty)
      .execute();

    const difficultyDistribution = {
      again: 0,
      hard: 0,
      good: 0,
      easy: 0,
    };

    for (const stat of difficultyStats) {
      const difficulty = stat.difficulty as "again" | "hard" | "good" | "easy";
      difficultyDistribution[difficulty] = stat.count;
    }

    // Calcular average_quality baseado na distribuição
    const qualityMap = { again: 0, hard: 2, good: 3, easy: 5 };
    const totalQuality =
      difficultyDistribution.again * qualityMap.again +
      difficultyDistribution.hard * qualityMap.hard +
      difficultyDistribution.good * qualityMap.good +
      difficultyDistribution.easy * qualityMap.easy;
    const averageQuality = totalReviews > 0 ? totalQuality / totalReviews : 0;

    // Contadores de status dos flashcards (simplificado)
    const masteredCount = 0; // TODO: Implementar lógica real baseada em SRS
    const learningCount = 0; // TODO: Implementar lógica real baseada em SRS
    const newCount = totalFlashcards - totalReviews;

    // 9. Estatísticas detalhadas de quizzes
    const quizStatsData = await db
      .select({
        total: count(),
        correct: sql<number>`SUM(CASE WHEN ${quiz_attempts.is_correct} THEN 1 ELSE 0 END)::int`,
      })
      .from(quiz_attempts)
      .where(eq(quiz_attempts.user_id, userId))
      .execute();

    const totalAttempts = quizStatsData[0]?.total || 0;
    const correctAttempts = quizStatsData[0]?.correct || 0;
    const accuracyPercentage =
      totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

    // 10. Atividade recente (últimos 7 dias)
    const recentActivity = await this.getRecentActivity(userId, 7);

    // 11. Próximas revisões (próximos 30 dias)
    const upcomingReviews = await this.getUpcomingReviews(userId, 30);

    return {
      total_materials: totalMaterials,
      total_flashcards: totalFlashcards,
      total_quizzes: totalQuizzes,
      flashcards_reviewed_today: flashcardsReviewedToday,
      quizzes_completed_today: quizzesCompletedToday,
      total_study_days: totalStudyDays,
      current_streak: currentStreak,
      flashcard_stats: {
        total_reviews: totalReviews,
        average_quality: Math.round(averageQuality * 100) / 100,
        mastered_count: masteredCount,
        learning_count: learningCount,
        new_count: newCount,
        difficulty_distribution: difficultyDistribution,
      },
      quiz_stats: {
        total_attempts: totalAttempts,
        correct_attempts: correctAttempts,
        accuracy_percentage: Math.round(accuracyPercentage * 100) / 100,
        average_time_per_quiz: 0, // TODO: Implementar se houver campo de tempo
      },
      recent_activity: recentActivity,
      upcoming_reviews: upcomingReviews,
    };
  }

  private async calculateStreak(userId: string, todayBrasil: string): Promise<number> {
    // Buscar últimos 60 dias de atividade de flashcards
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const flashcardDays = await db
      .select({
        date: sql<string>`to_char(${flashcard_reviews.reviewed_at} AT TIME ZONE 'UTC' - INTERVAL '3 hours', 'YYYY-MM-DD')`,
      })
      .from(flashcard_reviews)
      .where(
        and(
          eq(flashcard_reviews.user_id, userId),
          gte(flashcard_reviews.reviewed_at, sixtyDaysAgo)
        )
      )
      .groupBy(sql`to_char(${flashcard_reviews.reviewed_at} AT TIME ZONE 'UTC' - INTERVAL '3 hours', 'YYYY-MM-DD')`)
      .execute();

    // Buscar últimos 60 dias de atividade de quizzes
    const quizDays = await db
      .select({
        date: sql<string>`to_char(${quiz_attempts.attempted_at} AT TIME ZONE 'UTC' - INTERVAL '3 hours', 'YYYY-MM-DD')`,
      })
      .from(quiz_attempts)
      .where(
        and(
          eq(quiz_attempts.user_id, userId),
          gte(quiz_attempts.attempted_at, sixtyDaysAgo)
        )
      )
      .groupBy(sql`to_char(${quiz_attempts.attempted_at} AT TIME ZONE 'UTC' - INTERVAL '3 hours', 'YYYY-MM-DD')`)
      .execute();

    // Combinar todos os dias únicos de atividade
    const allActivityDates = new Set<string>();
    for (const day of flashcardDays) {
      allActivityDates.add(day.date);
    }
    for (const day of quizDays) {
      allActivityDates.add(day.date);
    }

    if (allActivityDates.size === 0) return 0;

    // Parsear todayBrasil para calcular os dias anteriores
    const [yearStr, monthStr, dayStr] = todayBrasil.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1; // JavaScript months are 0-indexed
    const day = parseInt(dayStr);

    // Verificar se tem atividade hoje
    const hasActivityToday = allActivityDates.has(todayBrasil);

    // Se não tem atividade hoje, verificar se tem atividade ontem
    // Se sim, o streak continua (só começa de ontem)
    // Se não, o streak está quebrado
    let startDay = 0;

    if (hasActivityToday) {
      // Tem atividade hoje, streak começa de hoje
      startDay = 0;
    } else {
      // Não tem atividade hoje, verificar ontem
      const yesterday = new Date(year, month, day);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      if (allActivityDates.has(yesterdayStr)) {
        // Tem atividade ontem, streak continua mas começa de ontem
        startDay = 1;
      } else {
        // Não tem atividade nem hoje nem ontem, streak quebrado
        return 0;
      }
    }

    // Calcular streak consecutivo
    let streak = 0;

    // Iterar dia por dia começando do dia inicial calculado
    for (let i = startDay; i < 60; i++) {
      const checkDate = new Date(year, month, day);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;

      if (allActivityDates.has(checkDateStr)) {
        streak++;
      } else {
        // Primeiro dia sem atividade = fim do streak
        break;
      }
    }

    return streak;
  }

  private async getRecentActivity(
    userId: string,
    days: number
  ): Promise<RecentActivity[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Atividade de flashcards por dia
    const flashcardActivity = await db
      .select({
        date: sql<string>`DATE(${flashcard_reviews.reviewed_at} AT TIME ZONE 'America/Sao_Paulo')`,
        count: count(),
      })
      .from(flashcard_reviews)
      .where(
        and(
          eq(flashcard_reviews.user_id, userId),
          gte(flashcard_reviews.reviewed_at, startDate)
        )
      )
      .groupBy(sql`DATE(${flashcard_reviews.reviewed_at} AT TIME ZONE 'America/Sao_Paulo')`)
      .execute();

    // Atividade de quizzes por dia
    const quizActivity = await db
      .select({
        date: sql<string>`DATE(${quiz_attempts.attempted_at} AT TIME ZONE 'America/Sao_Paulo')`,
        count: count(),
      })
      .from(quiz_attempts)
      .where(
        and(
          eq(quiz_attempts.user_id, userId),
          gte(quiz_attempts.attempted_at, startDate)
        )
      )
      .groupBy(sql`DATE(${quiz_attempts.attempted_at} AT TIME ZONE 'America/Sao_Paulo')`)
      .execute();

    // Combinar atividades por data
    const activityMap = new Map<string, RecentActivity>();

    for (const activity of flashcardActivity) {
      activityMap.set(activity.date, {
        date: activity.date,
        flashcards_reviewed: activity.count,
        quizzes_completed: 0,
        study_time_minutes: 0,
      });
    }

    for (const activity of quizActivity) {
      const existing = activityMap.get(activity.date);
      if (existing) {
        existing.quizzes_completed = activity.count;
      } else {
        activityMap.set(activity.date, {
          date: activity.date,
          flashcards_reviewed: 0,
          quizzes_completed: activity.count,
          study_time_minutes: 0,
        });
      }
    }

    return Array.from(activityMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }

  private async getUpcomingReviews(
    userId: string,
    days: number
  ): Promise<UpcomingReview[]> {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    // Buscar flashcards com next_review agendado nos próximos N dias, com informações do material
    const upcomingFlashcards = await db
      .select({
        date: sql<string>`DATE(${flashcards.next_review} AT TIME ZONE 'America/Sao_Paulo')`,
        material_id: flashcards.material_id,
        material_title: materials.title,
        count: count(),
      })
      .from(flashcards)
      .innerJoin(materials, eq(flashcards.material_id, materials.id))
      .where(
        and(
          eq(flashcards.user_id, userId),
          gte(flashcards.next_review, today),
          lte(flashcards.next_review, endDate)
        )
      )
      .groupBy(
        sql`DATE(${flashcards.next_review} AT TIME ZONE 'America/Sao_Paulo')`,
        flashcards.material_id,
        materials.title
      )
      .execute();

    // Agrupar por data e material
    const reviewsMap = new Map<string, UpcomingReview>();

    for (const review of upcomingFlashcards) {
      const existing = reviewsMap.get(review.date);

      const materialInfo: UpcomingReviewMaterial = {
        material_id: review.material_id,
        material_title: review.material_title,
        flashcards_count: review.count,
      };

      if (existing) {
        existing.flashcards_due += review.count;
        existing.materials.push(materialInfo);
      } else {
        reviewsMap.set(review.date, {
          date: review.date,
          flashcards_due: review.count,
          materials: [materialInfo],
        });
      }
    }

    return Array.from(reviewsMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }
}
