import { api } from "@/lib/axios";

// ========== TYPES ==========

export type Summary = {
  id: string;
  content: string;
  material_id: string;
  material_title?: string;
  created_at: string;
};

export type GetSummariesResponse = Summary[];

export type GetSummaryResponse = {
  id: string;
  content: string;
  material_id: string;
  created_at: string;
};

// ========== API FUNCTIONS ==========

/**
 * Lista todos os resumos do usuário
 */
export async function getSummaries(page = 1) {
  const response = await api.get<GetSummariesResponse>("/summaries", {
    params: { page },
  });

  return response.data;
}

/**
 * Busca o resumo de um material específico
 */
export async function getSummary(materialId: string) {
  const response = await api.get<GetSummaryResponse>(
    `/materials/${materialId}/summary`
  );

  return response.data;
}