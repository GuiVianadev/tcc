import { api } from "@/lib/axios";

export type CardCreateBody = {
  deck_id: number;
  front: string;
  back: string;
  card_type?: "basic" | "cloze" | "multiple_choice";
  front_media?: Record<string, any>;
  back_media?: Record<string, any>;
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard";
  estimated_time?: number;
};

export type CardUpdateBody = {
  front?: string;
  back?: string;
  card_type?: "basic" | "cloze" | "multiple_choice";
  front_media?: Record<string, any>;
  back_media?: Record<string, any>;
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard";
  estimated_time?: number;
};

export type CardResponse = {
  id: number;
  deck_id: number;
  front: string;
  back: string;
  card_type: string;
  front_media: Record<string, any>;
  back_media: Record<string, any>;
  tags: string[];
  difficulty: string;
  estimated_time: number;
  ease_factor: number;
  interval: number;
  repetitions: number;
  due_date?: string;
  total_reviews: number;
  correct_reviews: number;
  average_response_time: number;
  success_rate: number;
  created_at: string;
  updated_at?: string;
};

export type CardForStudyResponse = CardResponse & {
  is_new: boolean;
  is_learning: boolean;
  is_review: boolean;
};

export type DeleteCardResponse = {
  message: string;
};

export type GetCardsParams = {
  deck_id: number;
  skip?: number;
  limit?: number;
};

export type GetCardsForStudyParams = {
  deck_id: number;
  study_mode?: "review" | "learn" | "cram";
  limit?: number;
};

export async function getCards(params: GetCardsParams) {
  const response = await api.get<CardResponse[]>("/api/v1/cards/", { params });
  return response.data;
}

export async function getCardsForStudy(params: GetCardsForStudyParams) {
  const response = await api.get<CardForStudyResponse[]>(
    `/api/v1/cards/study/${params.deck_id}`,
    {
      params: {
        study_mode: params.study_mode,
        limit: params.limit,
      },
    }
  );
  return response.data;
}

export async function createCard(data: CardCreateBody) {
  const response = await api.post<CardResponse>("/api/v1/cards/", data);
  return response.data;
}

export async function getCard(cardId: number) {
  const response = await api.get<CardResponse>(`/api/v1/cards/${cardId}`);
  return response.data;
}

export async function updateCard(cardId: number, data: CardUpdateBody) {
  const response = await api.put<CardResponse>(`/api/v1/cards/${cardId}`, data);
  return response.data;
}

export async function deleteCard(cardId: number) {
  const response = await api.delete<DeleteCardResponse>(
    `/api/v1/cards/${cardId}`
  );
  return response.data;
}
