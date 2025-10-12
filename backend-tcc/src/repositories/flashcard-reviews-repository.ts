import type { InferSelectModel } from "drizzle-orm";
import type { flashcard_reviews } from "../db/schema.ts";

export type FlashcardReview = InferSelectModel<typeof flashcard_reviews>;

export interface CreateFlashcardReviewData {
  flashcard_id: string;
  user_id: string;
  difficulty: string;
  ease_factor_after: number;
  interval_days_after: number;
}

export interface FlashcardReviewsRepository {
  create(data: CreateFlashcardReviewData): Promise<FlashcardReview>;
  findByFlashcardId(flashcardId: string): Promise<FlashcardReview[]>;
  findByUserId(userId: string): Promise<FlashcardReview[]>;
}
