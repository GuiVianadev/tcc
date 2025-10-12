import type { InferSelectModel } from "drizzle-orm";
import type { quizzes } from "../db/schema.ts";

export type Quiz = InferSelectModel<typeof quizzes>;

export type QuizListItem = {
  id: string;
  question: string;
  material_id: string;
  material_title: string;
  created_at: Date;
};

export type QuizzesRepository = {
  findByMaterialId(materialId: string): Promise<Quiz[]>;
  findById(id: string): Promise<Quiz | null>;
  findManyByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<QuizListItem[]>;
  findUnstudiedByMaterialId(
    materialId: string,
    limit: number
  ): Promise<Quiz[]>;
  markAsStudied(quizId: string): Promise<Quiz>;
  countByMaterialId(materialId: string): Promise<number>;
  countStudiedByMaterialId(materialId: string): Promise<number>;
  resetProgress(materialId: string): Promise<void>;
};
