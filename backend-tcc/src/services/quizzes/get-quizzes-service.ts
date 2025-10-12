import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import type { Quiz, QuizzesRepository } from "../../repositories/quizzes-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

interface GetQuizzesRequest {
  userId: string;
  materialId: string;
}

export class GetQuizzesService {
  constructor(
    private materialsRepository: MaterialsRepository,
    private quizzesRepository: QuizzesRepository
  ) {}

  async execute({ userId, materialId }: GetQuizzesRequest): Promise<Quiz[]> {
    // Buscar material por ID
    const material = await this.materialsRepository.findById(materialId);

    if (!material) {
      throw new NotFoundError();
    }

    // Validar se o material pertence ao usuário
    if (material.user_id !== userId) {
      throw new UnauthorizedError();
    }

    // Buscar quizzes por material_id
    const quizzes = await this.quizzesRepository.findByMaterialId(materialId);

    return quizzes;
  }
}
