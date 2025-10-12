import type { Difficulty } from "../../lib/srs-algorithm.ts";
import { calculateSM2 } from "../../lib/srs-algorithm.ts";
import type { FlashcardReviewsRepository } from "../../repositories/flashcard-reviews-repository.ts";
import type {
  Flashcard,
  FlashcardsRepository,
} from "../../repositories/flashcards-repository.ts";
import type { MaterialsRepository } from "../../repositories/materials-repository.ts";
import type { StudySessionsRepository } from "../../repositories/study-sessions-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

type ReviewFlashcardRequest = {
  userId: string;
  flashcardId: string;
  difficulty: Difficulty;
};

type ReviewFlashcardResponse = {
  flashcard: Flashcard;
  nextReview: Date;
};

export class ReviewFlashcardService {
  constructor(
    private flashcardsRepository: FlashcardsRepository,
    private materialsRepository: MaterialsRepository,
    private flashcardReviewsRepository: FlashcardReviewsRepository,
    private studySessionsRepository: StudySessionsRepository
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
    const material = await this.materialsRepository.findById(
      flashcard.material_id
    );

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

    // Salvar histórico de revisão
    await this.flashcardReviewsRepository.create({
      flashcard_id: flashcardId,
      user_id: userId,
      difficulty,
      ease_factor_after: sm2Result.ease_factor,
      interval_days_after: sm2Result.interval_days,
    });

    // Atualizar study_session
    const isCorrect = difficulty === "good" || difficulty === "easy";
    await this.studySessionsRepository.upsertSession({
      user_id: userId,
      date: new Date(),
      flashcards_studied: 1,
      flashcards_correct: isCorrect ? 1 : 0,
    });

    return {
      flashcard: updatedFlashcard,
      nextReview: sm2Result.next_review,
    };
  }
}
