import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import type {
  SummariesRepository,
  Summary,
} from "../../repositories/summaries-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

interface GetSummaryRequest {
  userId: string;
  materialId: string;
}

export class GetSummaryService {
  constructor(
    private materialsRepository: MaterialsRepository,
    private summariesRepository: SummariesRepository
  ) {}

  async execute({ userId, materialId }: GetSummaryRequest): Promise<Summary> {
    // Buscar material por ID
    const material = await this.materialsRepository.findById(materialId);

    if (!material) {
      throw new NotFoundError();
    }

    // Validar se o material pertence ao usuário
    if (material.user_id !== userId) {
      throw new UnauthorizedError();
    }

    // Buscar summary por material_id
    const summary = await this.summariesRepository.findByMaterialId(materialId);

    if (!summary) {
      throw new NotFoundError();
    }

    return summary;
  }
}
