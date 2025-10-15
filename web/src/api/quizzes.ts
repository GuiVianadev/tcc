import { api } from "@/lib/axios";

// ========== TYPES ==========

export type QuizOption = {
  id: string;
  text: string;
};

export type Quiz = {
  id: string;
  question: string;
  options?: QuizOption[]; // Opcional, pode não vir na listagem
  correct_answer?: string; // Opcional, pode não vir na listagem
  studied?: boolean; // Opcional
  material_id: string;
  material_title?: string;
  created_at: string;
};

export type AnswerQuizRequest = {
  selectedAnswer: string;
};

export type AnswerQuizResponse = {
  isCorrect: boolean;
  correctAnswer: string;
};

export type QuizSession = {
  quizzes: Quiz[];
  session_size: number;
  total_quizzes: number;
  studied_count: number;
  remaining_count: number;
};

export type QuizProgress = {
  material_id: string;
  total_quizzes: number;
  studied_count: number;
  remaining_count: number;
  progress_percentage: number;
  is_completed: boolean;
};

export type GetQuizzesResponse = Quiz[];

// ========== API FUNCTIONS ==========

/**
 * Lista todos os quizzes do usuário
 */
export async function getAllQuizzes(page = 1) {
  const response = await api.get<GetQuizzesResponse>("/quizzes", {
    params: { page },
  });

  return response.data;
}

/**
 * Busca quizzes de um material específico
 */
export async function getMaterialQuizzes(materialId: string) {
  const response = await api.get<{ quizzes: Quiz[] }>(
    `/materials/${materialId}/quizzes`
  );

  return response.data.quizzes;
}

/**
 * Responde um quiz
 *
 * Comportamento:
 * - Marca automaticamente o quiz como studied = true
 * - Salva a tentativa em quiz_attempts
 * - Atualiza estatísticas do usuário
 * - Conta para o progresso do material
 */
export async function answerQuiz(quizId: string, data: AnswerQuizRequest) {
  const response = await api.post<AnswerQuizResponse>(
    `/quizzes/${quizId}/answer`,
    data
  );

  return response.data;
}

// ========== SISTEMA DE PROGRESSO ==========

/**
 * Inicia uma sessão de quiz (10 questões)
 *
 * Comportamento:
 * - Retorna até 10 questões NÃO estudadas
 * - Se houver menos de 10 questões restantes, retorna todas
 * - Se todas já foram estudadas, retorna array vazio
 */
export async function startQuizSession(materialId: string) {
  const response = await api.get<QuizSession>(
    `/materials/${materialId}/quizzes/session`
  );

  return response.data;
}

/**
 * Ver progresso dos quizzes de um material
 *
 * Cálculo: progress_percentage = (studied_count / total_quizzes) * 100
 */
export async function getQuizProgress(materialId: string) {
  const response = await api.get<QuizProgress>(
    `/materials/${materialId}/quizzes/progress`
  );

  return response.data;
}

/**
 * Reseta o progresso de todos os quizzes de um material
 *
 * Comportamento:
 * - Marca todos os quizzes do material como studied = false
 * - Permite refazer todos os quizzes
 * - NÃO deleta histórico de tentativas anteriores
 */
export async function resetQuizProgress(materialId: string) {
  const response = await api.post<{ message: string }>(
    `/materials/${materialId}/quizzes/reset`
  );

  return response.data;
}