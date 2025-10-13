import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DrizzleUsersRepository } from "../../../repositories/drizzle/drizzle-users-repository.ts";
import { CreateMaterialSplitService } from "../../materials/create-material-split.ts";

export function makeCreateMaterialSplit() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const usersRepository = new DrizzleUsersRepository();
  const createMaterialSplitService = new CreateMaterialSplitService(
    materialsRepository,
    usersRepository
  );
  return createMaterialSplitService;
}