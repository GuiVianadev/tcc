import { api } from "@/lib/axios";

// ========== TYPES ==========

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  material_id: string;
  material_title?: string;
  next_review: string;
  easiness_factor: number;
  interval: number;
  repetitions: number;
  created_at: string;
};

export type ReviewFlashcardRequest = {
  quality: 0 | 1 | 2 | 3 | 4 | 5;
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
  const response = await api.get<GetFlashcardsResponse>(
    `/materials/${materialId}/flashcards`
  );

  return response.data;
}

/**
 * Revisa um flashcard usando o sistema SRS (SM-2)
 *
 * Escala de qualidade:
 * - 0: Blackout completo (não lembrou)
 * - 1: Resposta incorreta, mas reconheceu ao ver
 * - 2: Resposta incorreta, mas quase lembrou
 * - 3: Resposta correta com dificuldade
 * - 4: Resposta correta com hesitação
 * - 5: Resposta correta perfeita
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