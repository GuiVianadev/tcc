import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DrizzleQuizzesRepository } from "../../../repositories/drizzle/drizzle-quizzes-repository.ts";
import { GetQuizProgressService } from "../../quizzes/get-quiz-progress-service.ts";

export function makeGetQuizProgressService() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const quizzesRepository = new DrizzleQuizzesRepository();
  const service = new GetQuizProgressService(materialsRepository, quizzesRepository);

  return service;
}
