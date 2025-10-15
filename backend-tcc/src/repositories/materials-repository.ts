import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { materials } from "../db/schema.ts";

export type Materials = InferSelectModel<typeof materials>;

export type CreateMaterialWithContent = {
  material: InferInsertModel<typeof materials>;
  summary: { content: string; user_id: string };
  flashcards: Array<{
    question: string;
    answer: string;
    user_id: string;
  }>;
  quizzes: Array<{
    question: string;
    options: unknown;
    correct_answer: string;
    user_id: string;
  }>;
};

export type MaterialsRepository = {
  create(
    data: InferInsertModel<typeof materials>
  ): Promise<InferInsertModel<typeof materials>>;
  createWithContent(data: CreateMaterialWithContent): Promise<{
    material: InferSelectModel<typeof materials>;
    summary: {
      id: string;
      content: string;
      material_id: string;
      user_id: string;
      created_at: Date;
    };
    flashcards: Array<{
      id: string;
      question: string;
      answer: string;
      user_id: string;
      material_id: string;
    }>;
    quizzes: Array<{
      id: string;
      question: string;
      options: unknown;
      correct_answer: string;
      material_id: string;
      user_id: string;
      created_at: Date;
    }>;
  }>;
  findById(id: string): Promise<InferSelectModel<typeof materials> | null>;
  searchManyByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<Materials[]>;
  searchRecentsByUserId(userId: string): Promise<Materials[]>;
  countByUserId(userId: string): Promise<number>;
  deleteMaterial(id: string): Promise<boolean>;
};
