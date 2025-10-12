import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import type { QuizzesRepository } from "../../repositories/quizzes-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

interface AnswerQuizRequest {
  userId: string;
  quizId: string;
  selectedAnswer: "a" | "b" | "c" | "d";
}

interface AnswerQuizResponse {
  isCorrect: boolean;
  correctAnswer: string;
}

export class AnswerQuizService {
  constructor(
    private materialsRepository: MaterialsRepository,
    private quizzesRepository: QuizzesRepository
  ) {}

  async execute({
    userId,
    quizId,
    selectedAnswer,
  }: AnswerQuizRequest): Promise<AnswerQuizResponse> {
    // Buscar quiz por ID
    const quiz = await this.quizzesRepository.findById(quizId);

    if (!quiz) {
      throw new NotFoundError();
    }

    // Buscar material do quiz
    const material = await this.materialsRepository.findById(quiz.material_id);

    if (!material) {
      throw new NotFoundError();
    }

    // Validar se material.user_id === userId
    if (material.user_id !== userId) {
      throw new UnauthorizedError();
    }

    // Comparar selectedAnswer com quiz.correct_answer
    const isCorrect = selectedAnswer === quiz.correct_answer;

    // TODO FUTURO: Salvar tentativa em quiz_attempts (opcional)

    return {
      isCorrect,
      correctAnswer: quiz.correct_answer,
    };
  }
}
