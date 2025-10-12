import { DrizzleFlashcardsRepository } from "../../../repositories/drizzle/drizzle-flashcards-repository.ts";
import { GetDueFlashcardsService } from "../../flashcards/get-due-flashcards-service.ts";

export function makeGetDueFlashcardsService() {
  const flashcardsRepository = new DrizzleFlashcardsRepository();
  const service = new GetDueFlashcardsService(flashcardsRepository);

  return service;
}