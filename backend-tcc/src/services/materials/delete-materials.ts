// services/delete-material-service.ts

import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

export type DeleteMaterialRequest = {
  userId: string;
  materialId: string;
};

export class DeleteMaterialService {
  private readonly materialRepository: MaterialsRepository;
  constructor(materialRepository: MaterialsRepository) {
    this.materialRepository = materialRepository;
  }

  async execute(request: DeleteMaterialRequest): Promise<void> {
    const { userId, materialId } = request;

    // 1. Buscar material por ID
    const material = await this.materialRepository.findById(materialId);

    // 2. Verificar se material existe
    if (!material) {
      throw new NotFoundError();
    }

    // 3. Verificar se o material pertence ao usu�rio
    if (material.user_id !== userId) {
      throw new UnauthorizedError();
    }

    // 4. Deletar material (cascata autom�tica pelo schema)
    await this.materialRepository.deleteMaterial(materialId);
  }
}
