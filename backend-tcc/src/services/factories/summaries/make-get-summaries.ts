import { DrizzleSummariesRepository } from "../../../repositories/drizzle/drizzle-summaries-repository.ts";
import { GetSummariesService } from "../../summaries/get-summaries-service.ts";

export function makeGetSummariesService() {
  const summariesRepository = new DrizzleSummariesRepository();
  const service = new GetSummariesService(summariesRepository);

  return service;
}
