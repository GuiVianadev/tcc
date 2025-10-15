import { useState, useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { answerQuiz, type Quiz } from "@/api/quizzes";

interface QuizSessionState {
  quizzes: Quiz[];
  currentIndex: number;
  answeredCount: number;
  selectedAnswer: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctAnswer: string | null;
}

/**
 * Hook para gerenciar sessão de quiz
 *
 * Features:
 * - Controla índice atual do quiz
 * - Gerencia seleção de resposta
 * - Integra com API de validação
 * - Mostra feedback (correto/incorreto)
 * - Avança automaticamente após resposta
 * - Reage automaticamente quando novos quizzes são carregados
 *
 * @param initialQuizzes - Array de quizzes para responder
 *
 * @example
 * ```tsx
 * const { currentQuiz, selectAnswer, submitAnswer, nextQuiz } =
 *   useQuizSession(quizzes);
 *
 * return (
 *   <div>
 *     <QuizCard quiz={currentQuiz} onSelect={selectAnswer} />
 *     <button onClick={submitAnswer}>Responder</button>
 *   </div>
 * );
 * ```
 */
export function useQuizSession(initialQuizzes: Quiz[]) {
  const queryClient = useQueryClient();

  const [session, setSession] = useState<QuizSessionState>({
    quizzes: initialQuizzes,
    currentIndex: 0,
    answeredCount: 0,
    selectedAnswer: null,
    isAnswered: false,
    isCorrect: null,
    correctAnswer: null,
  });

  // Atualizar sessão quando novos quizzes chegarem
  useEffect(() => {
    if (initialQuizzes.length > 0 && session.quizzes.length === 0) {
      setSession({
        quizzes: initialQuizzes,
        currentIndex: 0,
        answeredCount: 0,
        selectedAnswer: null,
        isAnswered: false,
        isCorrect: null,
        correctAnswer: null,
      });
    }
  }, [initialQuizzes, session.quizzes.length]);

  // Mutation para enviar resposta
  const answerMutation = useMutation({
    mutationFn: ({ quizId, selectedAnswer }: { quizId: string; selectedAnswer: string }) =>
      answerQuiz(quizId, { selectedAnswer }),
    onSuccess: (data) => {
      // Atualizar estado com resultado
      setSession((prev) => ({
        ...prev,
        isAnswered: true,
        isCorrect: data.isCorrect,
        correctAnswer: data.correctAnswer,
      }));

      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });

  const currentQuiz = session.quizzes[session.currentIndex];
  const hasNextQuiz = session.currentIndex < session.quizzes.length - 1;
  const isSessionComplete = session.quizzes.length > 0 && session.currentIndex >= session.quizzes.length;

  const progress = {
    current: session.answeredCount,
    total: session.quizzes.length,
    percentage: session.quizzes.length > 0
      ? Math.round((session.answeredCount / session.quizzes.length) * 100)
      : 0,
  };

  // Selecionar uma resposta
  const selectAnswer = useCallback((answer: string) => {
    if (session.isAnswered) return; // Não pode mudar depois de responder
    setSession((prev) => ({ ...prev, selectedAnswer: answer }));
  }, [session.isAnswered]);

  // Submeter resposta
  const submitAnswer = useCallback(async () => {
    if (!currentQuiz || !session.selectedAnswer || session.isAnswered) return;

    try {
      await answerMutation.mutateAsync({
        quizId: currentQuiz.id,
        selectedAnswer: session.selectedAnswer,
      });
    } catch (error) {
      console.error("Erro ao responder quiz:", error);
    }
  }, [currentQuiz, session.selectedAnswer, session.isAnswered, answerMutation]);

  // Avançar para próximo quiz
  const nextQuiz = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
      answeredCount: prev.answeredCount + 1,
      selectedAnswer: null,
      isAnswered: false,
      isCorrect: null,
      correctAnswer: null,
    }));
  }, []);

  // Resetar sessão
  const resetSession = useCallback(() => {
    setSession({
      quizzes: initialQuizzes,
      currentIndex: 0,
      answeredCount: 0,
      selectedAnswer: null,
      isAnswered: false,
      isCorrect: null,
      correctAnswer: null,
    });
  }, [initialQuizzes]);

  return {
    currentQuiz,
    selectedAnswer: session.selectedAnswer,
    isAnswered: session.isAnswered,
    isCorrect: session.isCorrect,
    correctAnswer: session.correctAnswer,
    progress,
    hasNextQuiz,
    isSessionComplete,
    isSubmitting: answerMutation.isPending,
    selectAnswer,
    submitAnswer,
    nextQuiz,
    resetSession,
  };
}