import { api } from "@/lib/axios";

export type AIGenerationRequestBody = {
  input_type: "text" | "pdf" | "url" | "youtube";
  input_content?: string;
  input_metadata?: Record<string, any>;
  ai_model?: string;
  ai_provider?: "openai" | "anthropic" | "google";
  deck_id?: number;
  generation_settings?: Record<string, any>;
};

export type AIGenerationResponse = {
  id: number;
  user_id: number;
  input_type: string;
  input_content?: string;
  input_metadata: Record<string, any>;
  ai_model: string;
  ai_provider: string;
  deck_id?: number;
  generation_settings: Record<string, any>;
  status: string;
  generated_cards: Record<string, any>[];
  cards_created: number;
  error_message?: string;
  processing_time?: number;
  tokens_used?: number;
  cost?: string;
  user_rating?: number;
  user_feedback?: string;
  created_at: string;
  completed_at?: string;
};

export type AIGenerationTaskResponse = {
  task_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  message?: string;
  result?: Record<string, any>;
  error?: string;
};

export type GetAIGenerationsParams = {
  skip?: number;
  limit?: number;
};

export async function generateFlashcards(data: AIGenerationRequestBody) {
  const response = await api.post<AIGenerationResponse>("/api/v1/ai-generation/generate", data);
  return response.data;
}

export async function getAIGenerations(params?: GetAIGenerationsParams) {
  const response = await api.get<AIGenerationResponse[]>("/api/v1/ai-generation/", { params });
  return response.data;
}

export async function getAIGeneration(generationId: number) {
  const response = await api.get<AIGenerationResponse>(`/api/v1/ai-generation/${generationId}`);
  return response.data;
}

export async function getTaskStatus(taskId: string) {
  const response = await api.get<AIGenerationTaskResponse>(`/api/v1/ai-generation/task/${taskId}`);
  return response.data;
}
