import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DrizzleQuizzesRepository } from "../../../repositories/drizzle/drizzle-quizzes-repository.ts";
import { StartQuizSessionService } from "../../quizzes/start-quiz-session-service.ts";

export function makeStartQuizSessionService() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const quizzesRepository = new DrizzleQuizzesRepository();
  const service = new StartQuizSessionService(materialsRepository, quizzesRepository);

  return service;
}
