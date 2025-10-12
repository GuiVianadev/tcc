import type { InferSelectModel } from "drizzle-orm";
import type { flashcards } from "../db/schema.ts";

export type Flashcard = InferSelectModel<typeof flashcards>;

export type FlashcardListItem = {
  id: string;
  question: string;
  material_id: string;
  material_title: string;
  next_review: Date | null;
  created_at: Date;
};

export type UpdateReviewData = {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: Date;
};

export type FlashcardsRepository = {
  findByMaterialId(materialId: string): Promise<Flashcard[]>;
  findById(id: string): Promise<Flashcard | null>;
  findDueCards(userId: string): Promise<Flashcard[]>;
  findManyByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<FlashcardListItem[]>;
  updateReview(id: string, data: UpdateReviewData): Promise<Flashcard>;
};
