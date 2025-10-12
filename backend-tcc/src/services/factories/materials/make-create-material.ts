import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DrizzleUsersRepository } from "../../../repositories/drizzle/drizzle-users-repository.ts";
import { CreateMaterialService } from "../../materials/create-material.ts";

export function makeCreateMaterial() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const usersRepository = new DrizzleUsersRepository();
  const createMaterialService = new CreateMaterialService(
    materialsRepository,
    usersRepository
  );
  return createMaterialService;
}
