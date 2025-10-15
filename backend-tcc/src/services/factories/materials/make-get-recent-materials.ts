import { GetRecentMaterialsService } from "@/services/materials/get-recent-materials.ts";
import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DrizzleUsersRepository } from "../../../repositories/drizzle/drizzle-users-repository.ts";

export function makeGetRecentMaterials() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const usersRepository = new DrizzleUsersRepository();
  const getRecentMaterialsService = new GetRecentMaterialsService(
    materialsRepository,
    usersRepository
  );
  return getRecentMaterialsService;
}
