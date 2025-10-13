import type {
  SummariesRepository,
  SummaryListItem,
} from "../../repositories/summaries-repository.ts";

type GetSummariesRequest = {
  userId: string;
  page: number;
  pageSize: number;
};

export class GetSummariesService {
  constructor(private summariesRepository: SummariesRepository) {}

  async execute({
    userId,
    page,
    pageSize,
  }: GetSummariesRequest): Promise<SummaryListItem[]> {
    const summaries = await this.summariesRepository.findManyByUserId(
      userId,
      page,
      pageSize
    );
    return summaries;
  }
}
