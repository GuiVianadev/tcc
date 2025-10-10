import { api } from "@/lib/axios";

export type UserUpdateBody = {
  full_name?: string;
  field_of_study?: string;
  learning_goals?: string;
  preferred_language?: string;
  settings?: Record<string, any>;
};

export type UserResponse = {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  field_of_study?: string;
  learning_goals?: string;
  preferred_language: string;
  is_active: boolean;
  is_verified: boolean;
  is_premium: boolean;
  total_cards_studied: number;
  current_streak: number;
  longest_streak: number;
  experience_points: number;
  level: number;
  created_at: string;
  last_login?: string;
  settings: Record<string, any>;
};

export type UserStatsResponse = {
  total_cards_studied: number;
  current_streak: number;
  longest_streak: number;
  experience_points: number;
  level: number;
  total_decks: number;
  total_reviews: number;
};

export type DeleteUserResponse = {
  message: string;
};

export async function getCurrentUser() {
  const response = await api.get<UserResponse>("/api/v1/users/me");
  return response.data;
}

export async function updateCurrentUser(data: UserUpdateBody) {
  const response = await api.put<UserResponse>("/api/v1/users/me", data);
  return response.data;
}

export async function deleteCurrentUser() {
  const response = await api.delete<DeleteUserResponse>("/api/v1/users/me");
  return response.data;
}

export async function getUserStats() {
  const response = await api.get<UserStatsResponse>("/api/v1/users/stats");
  return response.data;
}
