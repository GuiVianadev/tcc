import { useState, useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewFlashcard, type Flashcard } from "@/api/flashcards";

interface ReviewSession {
  flashcards: Flashcard[];
  currentIndex: number;
  reviewedCount: number;
  isFlipped: boolean;
}

/**
 * Hook para gerenciar sessão de revisão de flashcards
 *
 * Features:
 * - Controla estado de flip dos cards
 * - Gerencia índice atual da sessão
 * - Integra com API de revisão (SM-2)
 * - Invalida cache após cada revisão
 * - Reage automaticamente quando novos flashcards são carregados
 *
 * @param initialFlashcards - Array de flashcards para revisar
 *
 * @example
 * ```tsx
 * const { currentFlashcard, progress, flipCard, submitReview, isFlipped } =
 *   useFlashcardReview(dueFlashcards);
 *
 * return (
 *   <div>
 *     <FlashcardCard flashcard={currentFlashcard} isFlipped={isFlipped} />
 *     <button onClick={flipCard}>Virar</button>
 *     <button onClick={() => submitReview(5)}>Perfeito!</button>
 *   </div>
 * );
 * ```
 */
export function useFlashcardReview(initialFlashcards: Flashcard[]) {
  const queryClient = useQueryClient();

  const [session, setSession] = useState<ReviewSession>({
    flashcards: initialFlashcards,
    currentIndex: 0,
    reviewedCount: 0,
    isFlipped: false,
  });

  // Atualizar sessão quando novos flashcards chegarem
  useEffect(() => {
    if (initialFlashcards.length > 0 && session.flashcards.length === 0) {
      setSession({
        flashcards: initialFlashcards,
        currentIndex: 0,
        reviewedCount: 0,
        isFlipped: false,
      });
    }
  }, [initialFlashcards, session.flashcards.length]);

  // Mutation para enviar revisão
  const reviewMutation = useMutation({
    mutationFn: ({ flashcardId, difficulty }: { flashcardId: string; difficulty: "again" | "hard" | "good" | "easy" }) =>
      reviewFlashcard(flashcardId, { difficulty }),
    onSuccess: () => {
      // Invalidar cache de flashcards para atualizar contadores
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      queryClient.invalidateQueries({ queryKey: ["flashcards", "due"] });
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });

  const currentFlashcard = session.flashcards[session.currentIndex];
  const hasNextCard = session.currentIndex < session.flashcards.length - 1;
  const isSessionComplete = session.flashcards.length > 0 && session.currentIndex >= session.flashcards.length;

  const progress = {
    current: session.reviewedCount,
    total: session.flashcards.length,
    percentage: Math.round((session.reviewedCount / session.flashcards.length) * 100),
  };

  // Virar o card atual
  const flipCard = useCallback(() => {
    setSession((prev) => ({ ...prev, isFlipped: !prev.isFlipped }));
  }, []);

  // Submeter revisão e avançar para próximo card
  const submitReview = useCallback(
    async (difficulty: "again" | "hard" | "good" | "easy") => {
      if (!currentFlashcard) return;

      try {
        await reviewMutation.mutateAsync({
          flashcardId: currentFlashcard.id,
          difficulty,
        });

        // Avançar para o próximo card
        setSession((prev) => ({
          ...prev,
          currentIndex: prev.currentIndex + 1,
          reviewedCount: prev.reviewedCount + 1,
          isFlipped: false, // Resetar flip para o próximo card
        }));
      } catch (error) {
        console.error("Erro ao revisar flashcard:", error);
      }
    },
    [currentFlashcard, reviewMutation]
  );

  // Resetar sessão
  const resetSession = useCallback(() => {
    setSession({
      flashcards: initialFlashcards,
      currentIndex: 0,
      reviewedCount: 0,
      isFlipped: false,
    });
  }, [initialFlashcards]);

  return {
    currentFlashcard,
    isFlipped: session.isFlipped,
    progress,
    hasNextCard,
    isSessionComplete,
    isReviewing: reviewMutation.isPending,
    flipCard,
    submitReview,
    resetSession,
  };
}