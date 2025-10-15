// services/get-materials-service.ts

import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import type { UserRepository } from "../../repositories/users-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";

export type GetRecentMaterialsRequest = {
  userId: string;
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
};

export class GetRecentMaterialsService {
  private readonly materialRepository: MaterialsRepository;
  private readonly userRepository: UserRepository;
  constructor(
    materialRepository: MaterialsRepository,
    userRepository: UserRepository
  ) {
    this.materialRepository = materialRepository;
    this.userRepository = userRepository;
  }

  async execute(
    request: GetRecentMaterialsRequest
  ): Promise<PaginatedMaterials> {
    const { userId } = request;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError();
    }

    const materials =
      await this.materialRepository.searchRecentsByUserId(userId);

    return {
      materials,
    };
  }
}
