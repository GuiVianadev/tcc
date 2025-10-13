import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  answerQuiz,
  getAllQuizzes,
  getMaterialQuizzes,
  getQuizProgress,
  resetQuizProgress,
  startQuizSession,
  type AnswerQuizRequest,
} from "@/api/quizzes";

/**
 * Hook para listar todos os quizzes do usuário
 */
export function useQuizzes(page = 1) {
  return useQuery({
    queryKey: ["quizzes", page],
    queryFn: () => getAllQuizzes(page),
  });
}

/**
 * Hook para listar quizzes de um material específico
 */
export function useMaterialQuizzes(materialId: string) {
  return useQuery({
    queryKey: ["materials", materialId, "quizzes"],
    queryFn: () => getMaterialQuizzes(materialId),
    enabled: !!materialId,
  });
}

/**
 * Hook para iniciar uma sessão de quiz (10 questões não estudadas)
 *
 * Comportamento:
 * - Retorna até 10 questões não estudadas
 * - Se houver menos de 10, retorna todas as restantes
 * - Se todas foram estudadas, retorna array vazio
 */
export function useQuizSession(materialId: string) {
  return useQuery({
    queryKey: ["materials", materialId, "quizzes", "session"],
    queryFn: () => startQuizSession(materialId),
    enabled: !!materialId,
  });
}

/**
 * Hook para ver o progresso dos quizzes de um material
 *
 * Retorna:
 * - total_quizzes: Total de quizzes do material
 * - studied_count: Quantos foram estudados
 * - remaining_count: Quantos faltam
 * - progress_percentage: Porcentagem de conclusão (0-100)
 * - is_completed: Se atingiu 100%
 */
export function useQuizProgress(materialId: string) {
  return useQuery({
    queryKey: ["materials", materialId, "quizzes", "progress"],
    queryFn: () => getQuizProgress(materialId),
    enabled: !!materialId,
  });
}

/**
 * Hook para responder um quiz
 *
 * Exemplo de uso:
 * ```tsx
 * const { mutate, isPending } = useAnswerQuiz();
 *
 * mutate({
 *   quizId: "uuid",
 *   selectedAnswer: "b"
 * });
 * ```
 */
export function useAnswerQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      selectedAnswer,
    }: {
      quizId: string;
      selectedAnswer: AnswerQuizRequest["selectedAnswer"];
    }) => answerQuiz(quizId, { selectedAnswer }),
    onSuccess: () => {
      // Invalida queries relacionadas para recarregar
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });
}

/**
 * Hook para resetar o progresso de quizzes de um material
 *
 * Comportamento:
 * - Marca todos os quizzes como studied = false
 * - Permite refazer todos os quizzes
 * - NÃO deleta histórico de tentativas anteriores
 *
 * Exemplo de uso:
 * ```tsx
 * const { mutate } = useResetQuizProgress();
 * mutate(materialId);
 * ```
 */
export function useResetQuizProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materialId: string) => resetQuizProgress(materialId),
    onSuccess: (_, materialId) => {
      // Invalida queries do material para recarregar
      queryClient.invalidateQueries({
        queryKey: ["materials", materialId, "quizzes"],
      });
    },
  });
}