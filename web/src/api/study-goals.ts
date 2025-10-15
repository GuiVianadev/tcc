import { api } from "@/lib/axios";

// ========== TYPES ==========

export type StudyGoals = {
  id: string;
  user_id: string;
  area_of_interest: string;
  daily_flashcards_goal: number;
  daily_quizzes_goal: number;
  created_at: string;
  updatedAt: string;
};

export type UpsertStudyGoalsRequest = {
  area_of_interest: string;
  daily_flashcards_goal: number;
  daily_quizzes_goal: number;
};

// ========== API FUNCTIONS ==========

/**
 * Busca as metas de estudo do usuário
 */
export async function getStudyGoals() {
  const response = await api.get<StudyGoals>("/study-goals");
  return response.data;
}

/**
 * Criar ou atualizar metas de estudo
 */
export async function upsertStudyGoals(data: UpsertStudyGoalsRequest) {
  const response = await api.post<StudyGoals>("/study-goals", data);
  return response.data;
}