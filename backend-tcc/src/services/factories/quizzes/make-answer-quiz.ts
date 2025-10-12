import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DrizzleQuizzesRepository } from "../../../repositories/drizzle/drizzle-quizzes-repository.ts";
import { AnswerQuizService } from "../../quizzes/answer-quiz-service.ts";

export function makeAnswerQuizService() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const quizzesRepository = new DrizzleQuizzesRepository();
  const service = new AnswerQuizService(materialsRepository, quizzesRepository);

  return service;
}
