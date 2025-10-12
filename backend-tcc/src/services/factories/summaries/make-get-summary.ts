import { DrizzleMaterialsRepository } from "../../../repositories/drizzle/drizzle-materials-repository.ts";
import { DrizzleSummariesRepository } from "../../../repositories/drizzle/drizzle-summaries-repository.ts";
import { GetSummaryService } from "../../summaries/get-summary-service.ts";

export function makeGetSummaryService() {
  const materialsRepository = new DrizzleMaterialsRepository();
  const summariesRepository = new DrizzleSummariesRepository();
  const service = new GetSummaryService(materialsRepository, summariesRepository);

  return service;
}
