import type { QuizzesRepository } from "../../repositories/quizzes-repository.ts";
import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

interface ResetQuizProgressRequest {
  userId: string;
  materialId: string;
}

export class ResetQuizProgressService {
  constructor(
    private materialsRepository: MaterialsRepository,
    private quizzesRepository: QuizzesRepository
  ) {}

  async execute({
    userId,
    materialId,
  }: ResetQuizProgressRequest): Promise<void> {
    // Buscar material
    const material = await this.materialsRepository.findById(materialId);

    if (!material) {
      throw new NotFoundError();
    }

    // Validar permissão
    if (material.user_id !== userId) {
      throw new UnauthorizedError();
    }

    // Resetar progresso (marcar todos como não estudados)
    await this.quizzesRepository.resetProgress(materialId);
  }
}
