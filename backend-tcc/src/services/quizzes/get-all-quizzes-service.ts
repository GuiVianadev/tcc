import type { QuizListItem, QuizzesRepository } from "../../repositories/quizzes-repository.ts";

interface GetAllQuizzesRequest {
  userId: string;
  page: number;
  pageSize: number;
}

export class GetAllQuizzesService {
  constructor(private quizzesRepository: QuizzesRepository) {}

  async execute({ userId, page, pageSize }: GetAllQuizzesRequest): Promise<QuizListItem[]> {
    const quizzes = await this.quizzesRepository.findManyByUserId(userId, page, pageSize);
    return quizzes;
  }
}
