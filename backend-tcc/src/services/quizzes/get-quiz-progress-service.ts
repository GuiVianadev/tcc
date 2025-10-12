import type { QuizzesRepository } from "../../repositories/quizzes-repository.ts";
import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

interface GetQuizProgressRequest {
  userId: string;
  materialId: string;
}

interface GetQuizProgressResponse {
  material_id: string;
  total_quizzes: number;
  studied_count: number;
  remaining_count: number;
  progress_percentage: number;
  is_completed: boolean;
}

export class GetQuizProgressService {
  constructor(
    private materialsRepository: MaterialsRepository,
    private quizzesRepository: QuizzesRepository
  ) {}

  async execute({
    userId,
    materialId,
  }: GetQuizProgressRequest): Promise<GetQuizProgressResponse> {
    // Buscar material
    const material = await this.materialsRepository.findById(materialId);

    if (!material) {
      throw new NotFoundError();
    }

    // Validar permissão
    if (material.user_id !== userId) {
      throw new UnauthorizedError();
    }

    // Contar quizzes
    const totalQuizzes = await this.quizzesRepository.countByMaterialId(materialId);
    const studiedCount = await this.quizzesRepository.countStudiedByMaterialId(materialId);
    const remainingCount = totalQuizzes - studiedCount;

    // Calcular porcentagem
    const progressPercentage = totalQuizzes > 0
      ? Math.round((studiedCount / totalQuizzes) * 100)
      : 0;

    const isCompleted = progressPercentage === 100;

    return {
      material_id: materialId,
      total_quizzes: totalQuizzes,
      studied_count: studiedCount,
      remaining_count: remainingCount,
      progress_percentage: progressPercentage,
      is_completed: isCompleted,
    };
  }
}
