import type { Flashcard, FlashcardsRepository } from "../../repositories/flashcards-repository.ts";
import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

interface GetMaterialFlashcardsRequest {
  userId: string;
  materialId: string;
}

export class GetMaterialFlashcardsService {
  constructor(
    private materialsRepository: MaterialsRepository,
    private flashcardsRepository: FlashcardsRepository
  ) {}

  async execute({
    userId,
    materialId,
  }: GetMaterialFlashcardsRequest): Promise<Flashcard[]> {
    // Buscar material + validar permissão
    const material = await this.materialsRepository.findById(materialId);

    if (!material) {
      throw new NotFoundError();
    }

    if (material.user_id !== userId) {
      throw new UnauthorizedError();
    }

    // Buscar flashcards por material_id
    const flashcards = await this.flashcardsRepository.findByMaterialId(materialId);

    return flashcards;
  }
}
