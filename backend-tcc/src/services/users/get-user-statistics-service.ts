import { and, count, eq, sql } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { flashcard_reviews, quiz_attempts } from "../../db/schema.ts";

interface GetUserStatisticsRequest {
  userId: string;
}

interface GetUserStatisticsResponse {
  quizzes: {
    total_attempts: number;
    correct_attempts: number;
    accuracy_rate: number;
  };
  flashcards: {
    total_reviews: number;
    difficulty_distribution: {
      again: number;
      hard: number;
      good: number;
      easy: number;
    };
  };
}

export class GetUserStatisticsService {
  async execute({
    userId,
  }: GetUserStatisticsRequest): Promise<GetUserStatisticsResponse> {
    // Estatísticas de quizzes
    const quizStats = await db
      .select({
        total: count(),
        correct: sql<number>`SUM(CASE WHEN ${quiz_attempts.is_correct} THEN 1 ELSE 0 END)::int`,
      })
      .from(quiz_attempts)
      .where(eq(quiz_attempts.user_id, userId))
      .execute();

    const totalAttempts = quizStats[0]?.total || 0;
    const correctAttempts = quizStats[0]?.correct || 0;
    const accuracyRate =
      totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

    // Estatísticas de flashcards - total de revisões
    const flashcardStats = await db
      .select({ total: count() })
      .from(flashcard_reviews)
      .where(eq(flashcard_reviews.user_id, userId))
      .execute();

    const totalReviews = flashcardStats[0]?.total || 0;

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

    return {
      quizzes: {
        total_attempts: totalAttempts,
        correct_attempts: correctAttempts,
        accuracy_rate: Math.round(accuracyRate * 100) / 100, // 2 decimais
      },
      flashcards: {
        total_reviews: totalReviews,
        difficulty_distribution: difficultyDistribution,
      },
    };
  }
}
