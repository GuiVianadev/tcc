import { DrizzleQuizzesRepository } from "../../../repositories/drizzle/drizzle-quizzes-repository.ts";
import { GetAllQuizzesService } from "../../quizzes/get-all-quizzes-service.ts";

export function makeGetAllQuizzesService() {
  const quizzesRepository = new DrizzleQuizzesRepository();
  const service = new GetAllQuizzesService(quizzesRepository);

  return service;
}
