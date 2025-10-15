import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllFlashcards,
  getDueFlashcards,
  getFlashcardHistory,
  getMaterialFlashcards,
  reviewFlashcard,
  type ReviewFlashcardRequest,
} from "@/api/flashcards";

/**
 * Hook para listar todos os flashcards do usuário
 */
export function useFlashcards(page = 1) {
  return useQuery({
    queryKey: ["flashcards", page],
    queryFn: () => getAllFlashcards(page),
  });
}

/**
 * Alias para useFlashcards (para compatibilidade)
 */
export const useAllFlashcards = useFlashcards;

/**
 * Hook para listar flashcards que precisam ser revisados (vencidos)
 *
 * Ideal para mostrar no dashboard ou página de revisão diária
 */
export function useDueFlashcards() {
  return useQuery({
    queryKey: ["flashcards", "due"],
    queryFn: getDueFlashcards,
    // Recarrega a cada 5 minutos para manter atualizado
    refetchInterval: 5 * 60 * 1000,
  });
}

/**
 * Hook para listar flashcards de um material específico
 */
export function useMaterialFlashcards(materialId: string) {
  return useQuery({
    queryKey: ["materials", materialId, "flashcards"],
    queryFn: () => getMaterialFlashcards(materialId),
    enabled: !!materialId,
  });
}

/**
 * Hook para buscar histórico de revisões de um flashcard
 */
export function useFlashcardHistory(flashcardId: string) {
  return useQuery({
    queryKey: ["flashcards", flashcardId, "history"],
    queryFn: () => getFlashcardHistory(flashcardId),
    enabled: !!flashcardId,
  });
}

/**
 * Hook para revisar um flashcard (Sistema SRS)
 *
 * Exemplo de uso:
 * ```tsx
 * const { mutate, isPending } = useReviewFlashcard();
 *
 * mutate({
 *   flashcardId: "uuid",
 *   difficulty: "good" // "again" | "hard" | "good" | "easy"
 * });
 * ```
 */
export function useReviewFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      flashcardId,
      difficulty,
    }: {
      flashcardId: string;
      difficulty: ReviewFlashcardRequest["difficulty"];
    }) => reviewFlashcard(flashcardId, { difficulty }),
    onSuccess: (_, variables) => {
      // Invalida queries relacionadas para recarregar
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      queryClient.invalidateQueries({
        queryKey: ["flashcards", variables.flashcardId, "history"],
      });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });
}
