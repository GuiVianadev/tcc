import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DrizzleQuizzesRepository } from "../../../repositories/drizzle/drizzle-quizzes-repository.ts";
import { ResetQuizProgressService } from "../../quizzes/reset-quiz-progress-service.ts";

export function makeResetQuizProgressService() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const quizzesRepository = new DrizzleQuizzesRepository();
  const service = new ResetQuizProgressService(materialsRepository, quizzesRepository);

  return service;
}
