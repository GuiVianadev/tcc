import { and, count, eq, gte, sql } from "drizzle-orm";
import { db } from "../../db/client.ts";
import {
  flashcard_reviews,
  quiz_attempts,
  users,
} from "../../db/schema.ts";

type RankingUser = {
  name: string;
  current_streak: number;
  total_study_days: number;
};

type GetUsersRankingResponse = {
  users: RankingUser[];
};

/**
 * Serviço para buscar TOP 10 usuários por atividade
 *
 * Performance otimizada:
 * - Uma única query agregada para buscar estatísticas de todos os usuários
 * - Cálculo de streak apenas para os top 10
 * - Limite de 10 resultados
 */
export class GetUsersRankingService {
  async execute(): Promise<GetUsersRankingResponse> {
    // Query otimizada: buscar estatísticas de TODOS os usuários em uma única query
    const usersStats = await db
      .select({
        user_id: users.id,
        user_name: users.name,
        user_email: users.email,
        total_study_days: sql<number>`COUNT(DISTINCT DATE(${flashcard_reviews.reviewed_at} AT TIME ZONE 'America/Sao_Paulo'))`,
        flashcard_count: sql<number>`COUNT(${flashcard_reviews.id})`,
      })
      .from(users)
      .leftJoin(flashcard_reviews, eq(users.id, flashcard_reviews.user_id))
      .groupBy(users.id, users.name, users.email)
      .execute();

    // Buscar contagem de quizzes em query separada (mais eficiente que subquery)
    const quizStats = await db
      .select({
        user_id: quiz_attempts.user_id,
        quiz_count: count(),
      })
      .from(quiz_attempts)
      .groupBy(quiz_attempts.user_id)
      .execute();

    // Criar mapa de quizzes por usuário
    const quizMap = new Map(
      quizStats.map((q) => [q.user_id, q.quiz_count])
    );

    // Combinar estatísticas (sem expor ID e email por segurança)
    const combinedStats = usersStats.map((stat) => ({
      user_id: stat.user_id, // Usado apenas internamente para calcular streak
      name: stat.user_name,
      total_study_days: stat.total_study_days || 0,
    }));

    // Ordenar por dias estudados e pegar apenas top 10
    const top10 = combinedStats
      .sort((a, b) => b.total_study_days - a.total_study_days)
      .slice(0, 10);

    // Calcular streak APENAS para os top 10 (economia massiva de queries)
    const usersWithStreak: RankingUser[] = [];
    for (const user of top10) {
      const streak = await this.calculateStreak(user.user_id);
      usersWithStreak.push({
        name: user.name,
        current_streak: streak,
        total_study_days: user.total_study_days,
      });
    }

    // Reordenar considerando o streak
    const finalRanking = usersWithStreak.sort((a, b) => {
      if (b.current_streak !== a.current_streak) {
        return b.current_streak - a.current_streak;
      }
      if (b.total_study_days !== a.total_study_days) {
        return b.total_study_days - a.total_study_days;
      }
    });

    return { users: finalRanking };
  }

  private async calculateStreak(userId: string): Promise<number> {
    // Calcular data de hoje no Brasil (UTC-3)
    const now = new Date();
    const brasilOffsetMs = -3 * 60 * 60 * 1000;
    const nowBrasil = new Date(now.getTime() + brasilOffsetMs);
    const year = nowBrasil.getUTCFullYear();
    const month = nowBrasil.getUTCMonth();
    const day = nowBrasil.getUTCDate();
    const todayBrasil = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Buscar últimos 60 dias de atividade
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
      .groupBy(
        sql`to_char(${flashcard_reviews.reviewed_at} AT TIME ZONE 'UTC' - INTERVAL '3 hours', 'YYYY-MM-DD')`
      )
      .execute();

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
      .groupBy(
        sql`to_char(${quiz_attempts.attempted_at} AT TIME ZONE 'UTC' - INTERVAL '3 hours', 'YYYY-MM-DD')`
      )
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
    const [yearStr, monthStr, dayStr] = todayBrasil.split("-");
    const yearNum = parseInt(yearStr);
    const monthNum = parseInt(monthStr) - 1;
    const dayNum = parseInt(dayStr);

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
      const yesterday = new Date(yearNum, monthNum, dayNum);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

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
      const checkDate = new Date(yearNum, monthNum, dayNum);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;

      if (allActivityDates.has(checkDateStr)) {
        streak++;
      } else {
        // Primeiro dia sem atividade = fim do streak
        break;
      }
    }

    return streak;
  }
}