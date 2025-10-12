import type { Difficulty } from "../../lib/srs-algorithm.ts";
import { calculateSM2 } from "../../lib/srs-algorithm.ts";
import type { Flashcard, FlashcardsRepository } from "../../repositories/flashcards-repository.ts";
import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

interface ReviewFlashcardRequest {
  userId: string;
  flashcardId: string;
  difficulty: Difficulty;
}

interface ReviewFlashcardResponse {
  flashcard: Flashcard;
  nextReview: Date;
}

export class ReviewFlashcardService {
  constructor(
    private flashcardsRepository: FlashcardsRepository,
    private materialsRepository: MaterialsRepository
  ) {}

  async execute({
    userId,
    flashcardId,
    difficulty,
  }: ReviewFlashcardRequest): Promise<ReviewFlashcardResponse> {
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

    // Chamar calculateSM2 com dados atuais do card
    const sm2Result = calculateSM2({
      ease_factor: flashcard.ease_factor,
      interval_days: flashcard.interval_days,
      repetitions: flashcard.repetitions,
      difficulty,
    });

    // Atualizar card no banco com novos valores
    const updatedFlashcard = await this.flashcardsRepository.updateReview(
      flashcardId,
      sm2Result
    );

    // TODO FUTURO: Atualizar study_session (incrementar flashcards_studied)

    return {
      flashcard: updatedFlashcard,
      nextReview: sm2Result.next_review,
    };
  }
}
