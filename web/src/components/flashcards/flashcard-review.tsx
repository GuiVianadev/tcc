import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useReviewFlashcard } from "@/hooks/use-flashcards";
import type { Flashcard } from "@/api/flashcards";

interface FlashcardReviewProps {
  flashcard: Flashcard;
  onNext?: () => void;
}

/**
 * Componente para revisar flashcard usando o sistema SRS (SM-2)
 *
 * Funcionalidades:
 * - Mostra pergunta inicialmente
 * - Botão para revelar resposta
 * - Botões de qualidade (0-5) para o algoritmo SRS
 * - Callback para próximo flashcard
 */
export function FlashcardReview({ flashcard, onNext }: FlashcardReviewProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const { mutate: reviewFlashcard, isPending } = useReviewFlashcard();

  const handleReview = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    reviewFlashcard(
      { flashcardId: flashcard.id, quality },
      {
        onSuccess: () => {
          // Reseta o estado e vai para o próximo
          setShowAnswer(false);
          onNext?.();
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flashcard</CardTitle>
        <CardDescription>
          Próxima revisão:{" "}
          {new Date(flashcard.next_review).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pergunta */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Pergunta:
            </p>
            <p className="text-lg font-semibold">{flashcard.question}</p>
          </div>

          {/* Botão para mostrar/ocultar resposta */}
          {!showAnswer ? (
            <Button
              onClick={() => setShowAnswer(true)}
              className="w-full"
              variant="outline"
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver Resposta
            </Button>
          ) : (
            <>
              {/* Resposta */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Resposta:
                </p>
                <p className="text-base">{flashcard.answer}</p>
              </div>

              <Button
                onClick={() => setShowAnswer(false)}
                variant="ghost"
                size="sm"
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Ocultar Resposta
              </Button>
            </>
          )}

          {/* Botões de qualidade (SRS) */}
          {showAnswer && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-center">
                Como foi sua resposta?
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleReview(0)}
                  disabled={isPending}
                >
                  Não lembrei (0)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview(2)}
                  disabled={isPending}
                >
                  Quase (2)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview(3)}
                  disabled={isPending}
                >
                  Com dificuldade (3)
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleReview(5)}
                  disabled={isPending}
                >
                  Perfeito! (5)
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Sua resposta ajuda o algoritmo a calcular quando você deve
                revisar este flashcard novamente
              </p>
            </div>
          )}

          {/* Informações do SRS */}
          <div className="flex gap-4 text-xs text-muted-foreground justify-center">
            <span>Facilidade: {flashcard.easiness_factor.toFixed(2)}</span>
            <span>Intervalo: {flashcard.interval} dias</span>
            <span>Repetições: {flashcard.repetitions}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
