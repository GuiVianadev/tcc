import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DeleteMaterialService } from "../../materials/delete-materials.ts";

export function makeDeleteMaterial() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const deleteMaterialService = new DeleteMaterialService(materialsRepository);
  return deleteMaterialService;
}
