import { api } from "@/lib/axios";

type GetStatisticsResponse = {
  total_cards_studied: number;
  current_streak: number;
  longest_streak: number;
  experience_points: number;
  total_reviews: number;
  total_decks: number;
  level: number;
};

export async function getStatistics() {
  const response = await api.get<GetStatisticsResponse>("/api/v1/users/stats");
  return response.data;
}
