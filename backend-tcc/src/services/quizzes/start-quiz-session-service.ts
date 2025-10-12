import type { Quiz, QuizzesRepository } from "../../repositories/quizzes-repository.ts";
import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

interface StartQuizSessionRequest {
  userId: string;
  materialId: string;
}

interface StartQuizSessionResponse {
  quizzes: Quiz[];
  session_size: number;
  total_quizzes: number;
  studied_count: number;
  remaining_count: number;
}

export class StartQuizSessionService {
  private readonly SESSION_SIZE = 10;

  constructor(
    private materialsRepository: MaterialsRepository,
    private quizzesRepository: QuizzesRepository
  ) {}

  async execute({
    userId,
    materialId,
  }: StartQuizSessionRequest): Promise<StartQuizSessionResponse> {
    // Buscar material
    const material = await this.materialsRepository.findById(materialId);

    if (!material) {
      throw new NotFoundError();
    }

    // Validar permissão
    if (material.user_id !== userId) {
      throw new UnauthorizedError();
    }

    // Buscar quizzes não estudados (limite de 10)
    const unstudiedQuizzes = await this.quizzesRepository.findUnstudiedByMaterialId(
      materialId,
      this.SESSION_SIZE
    );

    // Contar total e estudados
    const totalQuizzes = await this.quizzesRepository.countByMaterialId(materialId);
    const studiedCount = await this.quizzesRepository.countStudiedByMaterialId(materialId);
    const remainingCount = totalQuizzes - studiedCount;

    return {
      quizzes: unstudiedQuizzes,
      session_size: this.SESSION_SIZE,
      total_quizzes: totalQuizzes,
      studied_count: studiedCount,
      remaining_count: remainingCount,
    };
  }
}
