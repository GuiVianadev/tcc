import type { Flashcard, FlashcardsRepository } from "../../repositories/flashcards-repository.ts";

interface GetDueFlashcardsRequest {
  userId: string;
}

interface GetDueFlashcardsResponse {
  flashcards: Flashcard[];
  totalDue: number;
}

export class GetDueFlashcardsService {
  constructor(private flashcardsRepository: FlashcardsRepository) {}

  async execute({ userId }: GetDueFlashcardsRequest): Promise<GetDueFlashcardsResponse> {
    const flashcards = await this.flashcardsRepository.findDueCards(userId);

    return {
      flashcards,
      totalDue: flashcards.length,
    };
  }
}