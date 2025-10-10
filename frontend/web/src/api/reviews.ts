import { api } from "@/lib/axios";

export type ReviewCreateBody = {
  card_id: number;
  rating: "again" | "hard" | "good" | "easy";
  response_time?: number;
  study_mode?: "review" | "learn" | "cram";
  study_session_id?: string;
  metadata?: Record<string, any>;
};

export type ReviewResponse = {
  id: number;
  user_id: number;
  card_id: number;
  rating: string;
  response_time?: number;
  study_mode: string;
  study_session_id?: string;
  metadata: Record<string, any>;
  ease_factor_before?: number;
  ease_factor_after?: number;
  interval_before?: number;
  interval_after?: number;
  created_at: string;
};

export type ReviewStatsResponse = {
  total_reviews: number;
  average_rating: number;
  cards_studied: number;
  streak: number;
};

export type GetReviewsParams = {
  card_id?: number;
  deck_id?: number;
  limit?: number;
};

export async function createReview(data: ReviewCreateBody) {
  const response = await api.post<ReviewResponse>("/api/v1/reviews/", data);
  return response.data;
}

export async function getReviews(params?: GetReviewsParams) {
  const response = await api.get<ReviewResponse[]>("/api/v1/reviews/", { params });
  return response.data;
}

export async function getReviewStats() {
  const response = await api.get<ReviewStatsResponse>("/api/v1/reviews/stats");
  return response.data;
}
