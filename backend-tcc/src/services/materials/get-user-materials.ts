// services/get-materials-service.ts

import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import type { UserRepository } from "../../repositories/users-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";

export type GetMaterialsRequest = {
  userId: string;
  page: number;
  pageSize: number;
};

export type PaginatedMaterials = {
  materials: Array<{
    id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
  }>;
  total: number;
  page: number;
  pageSize: number;
};

export class GetMaterialsService {
  private readonly materialRepository: MaterialsRepository;
  private readonly userRepository: UserRepository;
  constructor(
    materialRepository: MaterialsRepository,
    userRepository: UserRepository
  ) {
    this.materialRepository = materialRepository;
    this.userRepository = userRepository;
  }

  async execute(request: GetMaterialsRequest): Promise<PaginatedMaterials> {
    const { userId, page, pageSize } = request;

    // 1. Validar se usu�rio existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError();
    }

    // 2. Buscar materiais do usu�rio
    const materials = await this.materialRepository.searchManyByUserId(
      userId,
      page,
      pageSize
    );

    // 3. Calcular total (idealmente o repository deveria retornar isso tamb�m)
    // Por enquanto vou retornar o length, mas isso n�o � ideal para pagina��o real
    const total = materials.length;

    return {
      materials,
      total,
      page,
      pageSize,
    };
  }
}
