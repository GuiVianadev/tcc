import { api } from "@/lib/axios";

export type DeckCreateBody = {
  title: string;
  description?: string;
  subject?: string;
  tags?: string[];
  is_public?: boolean;
  difficulty_level?: "beginner" | "intermediate" | "advanced";
  srs_settings?: Record<string, any>;
};

export type DeckUpdateBody = {
  title?: string;
  description?: string;
  subject?: string;
  tags?: string[];
  is_public?: boolean;
  difficulty_level?: "beginner" | "intermediate" | "advanced";
  srs_settings?: Record<string, any>;
};

export type DeckResponse = {
  id: number;
  title: string;
  description?: string;
  subject?: string;
  tags: string[];
  is_public: boolean;
  difficulty_level: string;
  srs_settings: Record<string, any>;
  owner_id: number;
  total_cards: number;
  total_studies: number;
  average_rating: number;
  rating_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
};

export type DeckWithStatsResponse = DeckResponse & {
  cards_due_today: number;
  cards_new: number;
  cards_learning: number;
  cards_review: number;
  last_study_date?: string;
};

export type DeleteDeckResponse = {
  message: string;
};

export type GetDecksParams = {
  skip?: number;
  limit?: number;
  search?: string;
  subject?: string;
  is_public?: boolean;
};

export type GetPublicDecksParams = {
  skip?: number;
  limit?: number;
  search?: string;
  subject?: string;
};

export async function getDecks(params?: GetDecksParams) {
  const response = await api.get<DeckResponse[]>("/api/v1/decks/", { params });
  return response.data;
}

export async function getPublicDecks(params?: GetPublicDecksParams) {
  const response = await api.get<DeckResponse[]>("/api/v1/decks/public", {
    params,
  });
  return response.data;
}

export async function createDeck(data: DeckCreateBody) {
  const response = await api.post<DeckResponse>("/api/v1/decks/", data);
  return response.data;
}

export async function getDeck(deckId: number) {
  const response = await api.get<DeckWithStatsResponse>(
    `/api/v1/decks/${deckId}`
  );
  return response.data;
}

export async function updateDeck(deckId: number, data: DeckUpdateBody) {
  const response = await api.put<DeckResponse>(`/api/v1/decks/${deckId}`, data);
  return response.data;
}

export async function deleteDeck(deckId: number) {
  const response = await api.delete<DeleteDeckResponse>(
    `/api/v1/decks/${deckId}`
  );
  return response.data;
}
