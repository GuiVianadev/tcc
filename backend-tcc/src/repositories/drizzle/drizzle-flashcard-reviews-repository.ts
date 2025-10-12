import { eq } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { flashcard_reviews } from "../../db/schema.ts";
import type {
  CreateFlashcardReviewData,
  FlashcardReview,
  FlashcardReviewsRepository,
} from "../flashcard-reviews-repository.ts";

export class DrizzleFlashcardReviewsRepository
  implements FlashcardReviewsRepository
{
  async create(data: CreateFlashcardReviewData): Promise<FlashcardReview> {
    const [review] = await db
      .insert(flashcard_reviews)
      .values(data)
      .returning()
      .execute();

    return review;
  }

  async findByFlashcardId(flashcardId: string): Promise<FlashcardReview[]> {
    const reviews = await db
      .select()
      .from(flashcard_reviews)
      .where(eq(flashcard_reviews.flashcard_id, flashcardId))
      .orderBy(flashcard_reviews.reviewed_at)
      .execute();

    return reviews;
  }

  async findByUserId(userId: string): Promise<FlashcardReview[]> {
    const reviews = await db
      .select()
      .from(flashcard_reviews)
      .where(eq(flashcard_reviews.user_id, userId))
      .orderBy(flashcard_reviews.reviewed_at)
      .execute();

    return reviews;
  }
}
