import type { FlashcardReview, FlashcardReviewsRepository } from "../../repositories/flashcard-reviews-repository.ts";
import type { FlashcardsRepository } from "../../repositories/flashcards-repository.ts";
import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

interface GetFlashcardHistoryRequest {
  userId: string;
  flashcardId: string;
}

interface GetFlashcardHistoryResponse {
  reviews: FlashcardReview[];
}

export class GetFlashcardHistoryService {
  constructor(
    private flashcardsRepository: FlashcardsRepository,
    private materialsRepository: MaterialsRepository,
    private flashcardReviewsRepository: FlashcardReviewsRepository
  ) {}

  async execute({
    userId,
    flashcardId,
  }: GetFlashcardHistoryRequest): Promise<GetFlashcardHistoryResponse> {
    // Buscar flashcard por ID
    const flashcard = await this.flashcardsRepository.findById(flashcardId);

    if (!flashcard) {
      throw new NotFoundError();
    }

    // Buscar material do flashcard
    const material = await this.materialsRepository.findById(flashcard.material_id);

    if (!material) {
      throw new NotFoundError();
    }

    // Validar se material.user_id === userId
    if (material.user_id !== userId) {
      throw new UnauthorizedError();
    }

    // Buscar histórico de revisões
    const reviews = await this.flashcardReviewsRepository.findByFlashcardId(
      flashcardId
    );

    return {
      reviews,
    };
  }
}
