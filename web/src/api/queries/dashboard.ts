import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

// ========== TYPES ==========

type StudyActivityData = {
  date: string;
  cards_studied: number;
  study_time: number;
  accuracy: number;
};

type StudyDistributionData = {
  subject: string;
  cards_count: number;
  study_time: number;
};

type RecentCardData = {
  id: string;
  front: string;
  back: string;
  deck_name: string;
  accuracy: number;
  studied_at: string;
  question?: string;
  material_title?: string;
  next_review?: string;
  easiness_factor?: number;
  interval?: number;
};

type StudyGoalData = {
  id: string;
  title: string;
  description?: string;
  target_date: string;
  progress?: number;
  completed: boolean;
  is_completed: boolean;
  current_cards: number;
  target_cards: number;
};

type DashboardStatsData = {
  total_flashcards: number;
  flashcards_reviewed_today: number;
  total_quizzes: number;
  quizzes_completed_today: number;
  current_streak: number;
  total_study_days: number;
  daily_streak: number;
  cards_studied_today: number;
  average_accuracy: number;
  study_time_today: number;
  total_cards: number;
  cards_due_today: number;
  total_decks: number;
  cards_overdue: number;
};

// ========== API FUNCTIONS ==========

async function getStudyActivity(days: number): Promise<StudyActivityData[]> {
  const response = await api.get<StudyActivityData[]>(`/statistics/study-activity?days=${days}`);
  return response.data;
}

async function getStudyDistribution(): Promise<StudyDistributionData[]> {
  const response = await api.get<StudyDistributionData[]>("/statistics/study-distribution");
  return response.data;
}

async function getRecentCards(): Promise<RecentCardData[]> {
  const response = await api.get<RecentCardData[]>("/flashcards/recent");
  return response.data;
}

async function getStudyGoals(): Promise<StudyGoalData[]> {
  const response = await api.get<StudyGoalData[]>("/study-goals");
  return response.data;
}

async function getDashboardStats(): Promise<DashboardStatsData> {
  const response = await api.get<DashboardStatsData>("/users/me/statistics");
  return response.data;
}

// ========== REACT QUERY HOOKS ==========

export function useStudyActivity(days: number = 30) {
  return useQuery({
    queryKey: ["study-activity", days],
    queryFn: () => getStudyActivity(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useStudyDistribution() {
  return useQuery({
    queryKey: ["study-distribution"],
    queryFn: getStudyDistribution,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRecentCards() {
  return useQuery({
    queryKey: ["recent-cards"],
    queryFn: getRecentCards,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useStudyGoals() {
  return useQuery({
    queryKey: ["study-goals"],
    queryFn: getStudyGoals,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}