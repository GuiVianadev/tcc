import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DrizzleQuizzesRepository } from "../../../repositories/drizzle/drizzle-quizzes-repository.ts";
import { GetQuizzesService } from "../../quizzes/get-quizzes-service.ts";

export function makeGetQuizzesService() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const quizzesRepository = new DrizzleQuizzesRepository();
  const service = new GetQuizzesService(materialsRepository, quizzesRepository);

  return service;
}
