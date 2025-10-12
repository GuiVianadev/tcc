import type { SummaryListItem, SummariesRepository } from "../../repositories/summaries-repository.ts";

interface GetSummariesRequest {
  userId: string;
  page: number;
  pageSize: number;
}

export class GetSummariesService {
  constructor(private summariesRepository: SummariesRepository) {}

  async execute({ userId, page, pageSize }: GetSummariesRequest): Promise<SummaryListItem[]> {
    const summaries = await this.summariesRepository.findManyByUserId(userId, page, pageSize);
    return summaries;
  }
}
