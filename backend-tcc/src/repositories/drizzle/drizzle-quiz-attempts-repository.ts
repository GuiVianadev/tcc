import { eq } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { quiz_attempts } from "../../db/schema.ts";
import type {
  CreateQuizAttemptData,
  QuizAttempt,
  QuizAttemptsRepository,
} from "../quiz-attempts-repository.ts";

export class DrizzleQuizAttemptsRepository implements QuizAttemptsRepository {
  async create(data: CreateQuizAttemptData): Promise<QuizAttempt> {
    const [attempt] = await db
      .insert(quiz_attempts)
      .values(data)
      .returning()
      .execute();

    return attempt;
  }

  async findByQuizId(quizId: string): Promise<QuizAttempt[]> {
    const attempts = await db
      .select()
      .from(quiz_attempts)
      .where(eq(quiz_attempts.quiz_id, quizId))
      .orderBy(quiz_attempts.attempted_at)
      .execute();

    return attempts;
  }

  async findByUserId(userId: string): Promise<QuizAttempt[]> {
    const attempts = await db
      .select()
      .from(quiz_attempts)
      .where(eq(quiz_attempts.user_id, userId))
      .orderBy(quiz_attempts.attempted_at)
      .execute();

    return attempts;
  }
}
