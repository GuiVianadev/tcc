import { api } from "@/lib/axios";

// ========== TYPES ==========

export interface Material {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedMaterialsResponse {
  materials: Material[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetMaterialsParams {
  page?: number;
  pageSize?: number;
}

export interface CreateMaterialFromTopicRequest {
  title: string;
  topic: string;
  flashcardsQuantity?: number;
  quizzesQuantity?: number;
}

export interface CreateMaterialFromFileRequest {
  title: string;
  file: File;
  flashcardsQuantity?: number;
  quizzesQuantity?: number;
}

export interface CreateMaterialResponse {
  material: Material;
  summary?: {
    id: string;
    content: string;
  };
  flashcards?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  quizzes?: Array<{
    id: string;
    question: string;
    options: Array<{ id: string; text: string }>;
    correct_answer: string;
  }>;
}

// ========== API FUNCTIONS ==========

/**
 * Lista materiais do usuário com paginação
 *
 * @param params - Parâmetros de paginação (page, pageSize)
 * @returns Promise<PaginatedMaterialsResponse>
 *
 * Endpoint: GET /materials
 * Auth: Required (JWT)
 */
export async function getMaterials(
  params: GetMaterialsParams = {}
): Promise<PaginatedMaterialsResponse> {
  const { page = 1, pageSize = 10 } = params;

  const response = await api.get<PaginatedMaterialsResponse>("/materials", {
    params: { page, pageSize },
  });

  return response.data;
}

/**
 * Cria material a partir de um tópico/prompt
 *
 * A IA irá gerar:
 * - Conteúdo completo do material
 * - Resumo
 * - Flashcards (quantidade configurável)
 * - Quizzes (quantidade configurável)
 *
 * @param data - Título e tópico para gerar material
 * @returns Promise<CreateMaterialResponse>
 *
 * Endpoint: POST /materials (application/json)
 * Auth: Required (JWT)
 */
export async function createMaterialFromTopic(
  data: CreateMaterialFromTopicRequest
): Promise<CreateMaterialResponse> {
  const response = await api.post<CreateMaterialResponse>("/materials", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

/**
 * Cria material a partir de um arquivo (PDF, DOCX, TXT, PNG, JPG)
 *
 * A IA irá:
 * - Extrair conteúdo do arquivo
 * - Gerar resumo
 * - Criar flashcards (quantidade configurável)
 * - Criar quizzes (quantidade configurável)
 *
 * Tipos suportados:
 * - application/pdf
 * - application/vnd.openxmlformats-officedocument.wordprocessingml.document (DOCX)
 * - text/plain
 * - image/png
 * - image/jpeg
 *
 * Tamanho máximo: 10MB
 *
 * @param data - Título e arquivo
 * @returns Promise<CreateMaterialResponse>
 *
 * Endpoint: POST /materials (multipart/form-data)
 * Auth: Required (JWT)
 */
export async function createMaterialFromFile(
  data: CreateMaterialFromFileRequest
): Promise<CreateMaterialResponse> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("file", data.file);

  if (data.flashcardsQuantity) {
    formData.append("flashcardsQuantity", data.flashcardsQuantity.toString());
  }

  if (data.quizzesQuantity) {
    formData.append("quizzesQuantity", data.quizzesQuantity.toString());
  }

  const response = await api.post<CreateMaterialResponse>(
    "/materials",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

/**
 * Deleta um material (soft delete)
 *
 * @param materialId - ID do material a deletar
 * @returns Promise<void>
 *
 * Endpoint: DELETE /materials/:id
 * Auth: Required (JWT)
 */
export async function deleteMaterial(materialId: string): Promise<void> {
  await api.delete(`/materials/${materialId}`);
}