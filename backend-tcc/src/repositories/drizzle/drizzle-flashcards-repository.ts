import { asc, desc, eq, lte, or, isNull } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { flashcards, materials } from "../../db/schema.ts";
import type {
  Flashcard,
  FlashcardListItem,
  FlashcardsRepository,
  UpdateReviewData,
} from "../flashcards-repository.ts";

export class DrizzleFlashcardsRepository implements FlashcardsRepository {
  async findByMaterialId(materialId: string): Promise<Flashcard[]> {
    const flashcardsList = await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.material_id, materialId))
      .orderBy(asc(flashcards.created_at))
      .execute();

    return flashcardsList;
  }

  async findById(id: string): Promise<Flashcard | null> {
    const [flashcard] = await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.id, id))
      .execute();

    return flashcard || null;
  }

  async findDueCards(userId: string): Promise<Flashcard[]> {
    const now = new Date();

    const dueCards = await db
      .select()
      .from(flashcards)
      .where(
        eq(flashcards.user_id, userId)
      )
      .where(
        or(
          lte(flashcards.next_review, now),
          isNull(flashcards.next_review)
        )
      )
      .orderBy(asc(flashcards.next_review))
      .limit(50)
      .execute();

    return dueCards;
  }

  async findManyByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<FlashcardListItem[]> {
    const flashcardsList = await db
      .select({
        id: flashcards.id,
        question: flashcards.question,
        material_id: flashcards.material_id,
        material_title: materials.title,
        next_review: flashcards.next_review,
        created_at: flashcards.created_at,
      })
      .from(flashcards)
      .innerJoin(materials, eq(flashcards.material_id, materials.id))
      .where(eq(flashcards.user_id, userId))
      .orderBy(desc(flashcards.created_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute();

    return flashcardsList;
  }

  async updateReview(id: string, data: UpdateReviewData): Promise<Flashcard> {
    const [updatedFlashcard] = await db
      .update(flashcards)
      .set({
        ease_factor: data.ease_factor,
        interval_days: data.interval_days,
        repetitions: data.repetitions,
        next_review: data.next_review,
      })
      .where(eq(flashcards.id, id))
      .returning();

    return updatedFlashcard;
  }
}
