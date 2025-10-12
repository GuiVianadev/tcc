import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DrizzleUsersRepository } from "../../../repositories/drizzle/drizzle-users-repository.ts";
import { GetMaterialsService } from "../../materials/get-user-materials.ts";

export function makeGetMaterials() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const usersRepository = new DrizzleUsersRepository();
  const getMaterialsService = new GetMaterialsService(
    materialsRepository,
    usersRepository
  );
  return getMaterialsService;
}
