import { DrizzleFlashcardsRepository } from "../../../repositories/drizzle/drizzle-flashcards-repository.ts";
import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { ReviewFlashcardService } from "../../flashcards/review-flashcard-service.ts";

export function makeReviewFlashcardService() {
  const flashcardsRepository = new DrizzleFlashcardsRepository();
  const materialsRepository = new DrizzleMaterialsRepository();
  const service = new ReviewFlashcardService(flashcardsRepository, materialsRepository);

  return service;
}