import type { InferSelectModel } from "drizzle-orm";
import type { quiz_attempts } from "../db/schema.ts";

export type QuizAttempt = InferSelectModel<typeof quiz_attempts>;

export interface CreateQuizAttemptData {
  quiz_id: string;
  user_id: string;
  selected_answer: string;
  is_correct: boolean;
}

export interface QuizAttemptsRepository {
  create(data: CreateQuizAttemptData): Promise<QuizAttempt>;
  findByQuizId(quizId: string): Promise<QuizAttempt[]>;
  findByUserId(userId: string): Promise<QuizAttempt[]>;
}
