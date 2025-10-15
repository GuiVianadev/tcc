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
};

export class GetUserStatisticsService {
  async execute({
    userId,
  }: GetUserStatisticsRequest): Promise<GetUserStatisticsResponse> {
    // Início e fim do dia atual (UTC)
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

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

    // 4. Flashcards revisados hoje
    const flashcardsToday = await db
      .select({ total: count() })
      .from(flashcard_reviews)
      .where(
        and(
          eq(flashcard_reviews.user_id, userId),
          gte(flashcard_reviews.reviewed_at, startOfToday),
          lte(flashcard_reviews.reviewed_at, endOfToday)
        )
      )
      .execute();
    const flashcardsReviewedToday = flashcardsToday[0]?.total || 0;

    // 5. Quizzes respondidos hoje
    const quizzesToday = await db
      .select({ total: count() })
      .from(quiz_attempts)
      .where(
        and(
          eq(quiz_attempts.user_id, userId),
          gte(quiz_attempts.attempted_at, startOfToday),
          lte(quiz_attempts.attempted_at, endOfToday)
        )
      )
      .execute();
    const quizzesCompletedToday = quizzesToday[0]?.total || 0;

    // 6. Total de dias únicos com atividade
    const uniqueStudyDays = await db
      .selectDistinct({
        date: sql<string>`DATE(${flashcard_reviews.reviewed_at})`,
      })
      .from(flashcard_reviews)
      .where(eq(flashcard_reviews.user_id, userId))
      .execute();
    const totalStudyDays = uniqueStudyDays.length;

    // 7. Calcular streak (dias consecutivos)
    const currentStreak = await this.calculateStreak(userId);

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
    };
  }

  private async calculateStreak(userId: string): Promise<number> {
    // Buscar últimos 60 dias de atividade de flashcards
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const flashcardDays = await db
      .select({
        date: sql<string>`DATE(${flashcard_reviews.reviewed_at})`,
      })
      .from(flashcard_reviews)
      .where(
        and(
          eq(flashcard_reviews.user_id, userId),
          gte(flashcard_reviews.reviewed_at, sixtyDaysAgo)
        )
      )
      .groupBy(sql`DATE(${flashcard_reviews.reviewed_at})`)
      .execute();

    // Buscar últimos 60 dias de atividade de quizzes
    const quizDays = await db
      .select({
        date: sql<string>`DATE(${quiz_attempts.attempted_at})`,
      })
      .from(quiz_attempts)
      .where(
        and(
          eq(quiz_attempts.user_id, userId),
          gte(quiz_attempts.attempted_at, sixtyDaysAgo)
        )
      )
      .groupBy(sql`DATE(${quiz_attempts.attempted_at})`)
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

    // Converter Set para Array e ordenar (mais recente primeiro)
    const sortedDates = Array.from(allActivityDates).sort((a, b) =>
      b.localeCompare(a)
    );

    // Calcular streak consecutivo começando de hoje
    let streak = 0;
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

    // Iterar dia por dia começando de hoje
    for (let i = 0; i < 60; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const checkDateStr = checkDate.toISOString().split("T")[0];

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
        date: sql<string>`DATE(${flashcard_reviews.reviewed_at})`,
        count: count(),
      })
      .from(flashcard_reviews)
      .where(
        and(
          eq(flashcard_reviews.user_id, userId),
          gte(flashcard_reviews.reviewed_at, startDate)
        )
      )
      .groupBy(sql`DATE(${flashcard_reviews.reviewed_at})`)
      .execute();

    // Atividade de quizzes por dia
    const quizActivity = await db
      .select({
        date: sql<string>`DATE(${quiz_attempts.attempted_at})`,
        count: count(),
      })
      .from(quiz_attempts)
      .where(
        and(
          eq(quiz_attempts.user_id, userId),
          gte(quiz_attempts.attempted_at, startDate)
        )
      )
      .groupBy(sql`DATE(${quiz_attempts.attempted_at})`)
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
}
