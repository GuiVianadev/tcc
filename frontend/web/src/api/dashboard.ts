import { api } from "@/lib/axios";

export type DashboardStats = {
  daily_streak: number;
  cards_studied_today: number;
  average_accuracy: number;
  study_time_today: number; // em minutos
  total_cards: number;
  total_decks: number;
  cards_due_today: number;
  cards_overdue: number;
};

export type StudyActivity = {
  date: string;
  cards_studied: number;
  study_time: number;
  accuracy: number;
};

export type StudyDistribution = {
  subject: string;
  cards_count: number;
  study_time: number;
};

export type RecentCard = {
  id: number;
  front: string;
  back: string;
  deck_name: string;
  studied_at: string;
  accuracy: number;
};

export type StudyGoal = {
  id: number;
  title: string;
  target_cards: number;
  current_cards: number;
  target_date: string;
  is_completed: boolean;
};

export async function getDashboardStats() {
  const response = await api.get<DashboardStats>("/api/v1/dashboard/stats");
  return response.data;
}

export async function getStudyActivity(days: number = 30) {
  const response = await api.get<StudyActivity[]>(`/api/v1/dashboard/activity?days=${days}`);
  return response.data;
}

export async function getStudyDistribution() {
  const response = await api.get<StudyDistribution[]>("/api/v1/dashboard/distribution");
  return response.data;
}

export async function getRecentCards(limit: number = 10) {
  const response = await api.get<RecentCard[]>(`/api/v1/dashboard/recent-cards?limit=${limit}`);
  return response.data;
}

export async function getStudyGoals() {
  const response = await api.get<StudyGoal[]>("/api/v1/dashboard/goals");
  return response.data;
}

export async function createStudyGoal(data: Omit<StudyGoal, 'id' | 'current_cards' | 'is_completed'>) {
  const response = await api.post<StudyGoal>("/api/v1/dashboard/goals", data);
  return response.data;
}

export async function updateStudyGoal(id: number, data: Partial<StudyGoal>) {
  const response = await api.put<StudyGoal>(`/api/v1/dashboard/goals/${id}`, data);
  return response.data;
}

export async function deleteStudyGoal(id: number) {
  const response = await api.delete(`/api/v1/dashboard/goals/${id}`);
  return response.data;
}
