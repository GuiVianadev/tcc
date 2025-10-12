import { DrizzleFlashcardReviewsRepository } from "../../../repositories/drizzle/drizzle-flashcard-reviews-repository.ts";
import { DrizzleFlashcardsRepository } from "../../../repositories/drizzle/drizzle-flashcards-repository.ts";
import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { GetFlashcardHistoryService } from "../../flashcards/get-flashcard-history-service.ts";

export function makeGetFlashcardHistoryService() {
  const flashcardsRepository = new DrizzleFlashcardsRepository();
  const materialsRepository = new DrizzleMaterialsRepository();
  const flashcardReviewsRepository = new DrizzleFlashcardReviewsRepository();
  const service = new GetFlashcardHistoryService(
    flashcardsRepository,
    materialsRepository,
    flashcardReviewsRepository
  );

  return service;
}