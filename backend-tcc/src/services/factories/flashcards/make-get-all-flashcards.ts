import { DrizzleFlashcardsRepository } from "../../../repositories/drizzle/drizzle-flashcards-repository.ts";
import { GetAllFlashcardsService } from "../../flashcards/get-all-flashcards-service.ts";

export function makeGetAllFlashcardsService() {
  const flashcardsRepository = new DrizzleFlashcardsRepository();
  const service = new GetAllFlashcardsService(flashcardsRepository);

  return service;
}
