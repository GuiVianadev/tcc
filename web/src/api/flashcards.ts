import { api } from "@/lib/axios";

// ========== TYPES ==========

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  material_id: string;
  material_title?: string;
  next_review?: string; // Opcional na listagem
  easiness_factor?: number; // Opcional na listagem
  interval?: number; // Opcional na listagem
  repetitions?: number; // Opcional na listagem
  created_at: string;
};

export type ReviewFlashcardRequest = {
  difficulty: "again" | "hard" | "good" | "easy";
};

export type ReviewFlashcardResponse = {
  id: string;
  next_review: string;
  easiness_factor: number;
  interval: number;
  repetitions: number;
};

export type FlashcardReviewHistory = {
  id: string;
  flashcard_id: string;
  quality: number;
  reviewed_at: string;
  interval_days: number;
  easiness_factor: number;
};

export type GetFlashcardsResponse = Flashcard[];

export type GetFlashcardHistoryResponse = FlashcardReviewHistory[];

// ========== API FUNCTIONS ==========

/**
 * Lista todos os flashcards do usuário
 */
export async function getAllFlashcards(page = 1) {
  const response = await api.get<GetFlashcardsResponse>("/flashcards", {
    params: { page },
  });

  return response.data;
}

/**
 * Lista flashcards que precisam ser revisados (vencidos)
 */
export async function getDueFlashcards() {
  const response = await api.get<GetFlashcardsResponse>("/flashcards/due");

  return response.data;
}

/**
 * Busca flashcards de um material específico
 */
export async function getMaterialFlashcards(materialId: string) {
  const response = await api.get<{ flashcards: Flashcard[] }>(
    `/materials/${materialId}/flashcards`
  );
  return response.data.flashcards;
}

/**
 * Revisa um flashcard usando o sistema SRS
 *
 * Dificuldade:
 * - "again": Não lembrou, precisa revisar novamente em breve
 * - "hard": Lembrou com muita dificuldade
 * - "good": Lembrou corretamente
 * - "easy": Lembrou facilmente
 */
export async function reviewFlashcard(
  flashcardId: string,
  data: ReviewFlashcardRequest
) {
  const response = await api.post<ReviewFlashcardResponse>(
    `/flashcards/${flashcardId}/review`,
    data
  );

  return response.data;
}

/**
 * Busca o histórico de revisões de um flashcard
 */
export async function getFlashcardHistory(flashcardId: string) {
  const response = await api.get<GetFlashcardHistoryResponse>(
    `/flashcards/${flashcardId}/history`
  );

  return response.data;
}