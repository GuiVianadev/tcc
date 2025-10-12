import { DrizzleFlashcardsRepository } from "../../../repositories/drizzle/drizzle-flashcards-repository.ts";
import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { GetMaterialFlashcardsService } from "../../flashcards/get-material-flashcards-service.ts";

export function makeGetMaterialFlashcardsService() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const flashcardsRepository = new DrizzleFlashcardsRepository();
  const service = new GetMaterialFlashcardsService(materialsRepository, flashcardsRepository);

  return service;
}
