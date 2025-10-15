import { api } from "@/lib/axios";

// ========== TYPES ==========

export type FlashcardStats = {
  total_reviews: number;
  average_quality: number;
  mastered_count: number;
  learning_count: number;
  new_count: number;
  difficulty_distribution: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
};

export type QuizStats = {
  total_attempts: number;
  correct_attempts: number;
  accuracy_percentage: number;
  average_time_per_quiz: number;
};

export type RecentActivity = {
  date: string;
  flashcards_reviewed: number;
  quizzes_completed: number;
  study_time_minutes: number;
};

export type UserStatistics = {
  total_materials: number;
  total_flashcards: number;
  total_quizzes: number;
  flashcards_reviewed_today: number;
  quizzes_completed_today: number;
  total_study_days: number;
  current_streak: number;
  flashcard_stats: FlashcardStats;
  quiz_stats: QuizStats;
  recent_activity: RecentActivity[];
};

// ========== API FUNCTIONS ==========

/**
 * Obtém estatísticas completas do usuário
 *
 * Retorna informações sobre:
 * - Materiais, flashcards e quizzes totais
 * - Atividade diária (revisões e quizzes hoje)
 * - Streak de estudo
 * - Estatísticas detalhadas de flashcards (SRS)
 * - Estatísticas detalhadas de quizzes (acertos/erros)
 * - Histórico de atividades recentes
 */
export async function getUserStatistics() {
  const response = await api.get<UserStatistics>("/users/me/statistics");

  return response.data;
}