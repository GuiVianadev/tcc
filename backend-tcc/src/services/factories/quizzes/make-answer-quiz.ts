import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DrizzleQuizAttemptsRepository } from "../../../repositories/drizzle/drizzle-quiz-attempts-repository.ts";
import { DrizzleQuizzesRepository } from "../../../repositories/drizzle/drizzle-quizzes-repository.ts";
import { DrizzleStudySessionsRepository } from "../../../repositories/drizzle/drizzle-study-sessions-repository.ts";
import { AnswerQuizService } from "../../quizzes/answer-quiz-service.ts";

export function makeAnswerQuizService() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const quizzesRepository = new DrizzleQuizzesRepository();
  const quizAttemptsRepository = new DrizzleQuizAttemptsRepository();
  const studySessionsRepository = new DrizzleStudySessionsRepository();
  const service = new AnswerQuizService(
    materialsRepository,
    quizzesRepository,
    quizAttemptsRepository,
    studySessionsRepository
  );

  return service;
}
