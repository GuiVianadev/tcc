import type { FlashcardListItem, FlashcardsRepository } from "../../repositories/flashcards-repository.ts";

interface GetAllFlashcardsRequest {
  userId: string;
  page: number;
  pageSize: number;
}

export class GetAllFlashcardsService {
  constructor(private flashcardsRepository: FlashcardsRepository) {}

  async execute({
    userId,
    page,
    pageSize,
  }: GetAllFlashcardsRequest): Promise<FlashcardListItem[]> {
    const flashcards = await this.flashcardsRepository.findManyByUserId(
      userId,
      page,
      pageSize
    );

    return flashcards;
  }
}
