import { api } from "@/lib/axios";

// ========== TYPES ==========

export type UserStatistics = {
  quizzes: {
    total_attempts: number;
    correct_attempts: number;
    accuracy_rate: number;
  };
  flashcards: {
    total_reviews: number;
    difficulty_distribution: {
      again: number;
      hard: number;
      good: number;
      easy: number;
    };
  };
};

// ========== API FUNCTIONS ==========

/**
 * Busca estatísticas gerais do usuário
 *
 * Retorna:
 * - Estatísticas de quizzes (tentativas, acertos, taxa de acerto)
 * - Estatísticas de flashcards (total de revisões, distribuição de dificuldade)
 */
export async function getUserStatistics() {
  const response = await api.get<UserStatistics>("/users/statistics");
  return response.data;
}
