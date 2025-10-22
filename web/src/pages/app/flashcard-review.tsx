import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCw, CheckCircle, Trophy } from "lucide-react";
import { useDueFlashcards } from "@/hooks/use-flashcards";
import { useFlashcardReview } from "@/hooks/use-flashcard-review";
import { FlashcardReviewCard } from "@/components/flashcards/flashcard-review-card";
import type { Flashcard } from "@/api/flashcards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Página de revisão de flashcards com sistema SRS (SM-2)
 *
 * Features:
 * - Carrega flashcards vencidos
 * - Animação flip 3D
 * - Botões de qualidade (0-5) conforme algoritmo SM-2
 * - Barra de progresso da sessão
 * - Tela de conclusão com estatísticas
 *
 * Rota: /flashcards/review
 */
export function FlashcardReview() {
  const navigate = useNavigate();
  const { data: dueFlashcards, isLoading } = useDueFlashcards();

  // Garantir que seja array
  const flashcardsArray: Flashcard[] = Array.isArray(dueFlashcards)
    ? dueFlashcards
    : (dueFlashcards as any)?.flashcards
      ? (dueFlashcards as any).flashcards
      : [];

  const {
    currentFlashcard,
    isFlipped,
    progress,
    isSessionComplete,
    isReviewing,
    flipCard,
    submitReview,
  } = useFlashcardReview(flashcardsArray);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
      </div>
    );
  }

  // Nenhum flashcard para revisar
  if (flashcardsArray.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold">Tudo em dia!</h2>
              <p className="text-muted-foreground">
                Você não tem flashcards para revisar no momento.
              </p>
              <Button onClick={() => navigate("/app/flashcards")}>
                Voltar para Flashcards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sessão concluída
  if (isSessionComplete) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              Sessão Concluída!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-primary">
                {progress.total}
              </p>
              <p className="text-muted-foreground">
                flashcards revisados com sucesso
              </p>
            </div>

            <div className="pt-6 border-t space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Continue revisando regularmente para fixar o conhecimento na
                memória de longo prazo usando a técnica de Repetição Espaçada
                (SRS - SM-2).
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => navigate("/app/flashcards")}
                  variant="outline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Flashcards
                </Button>
                <Button onClick={() => navigate("/app")}>
                  Ir para Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Botões de dificuldade
  const difficultyButtons = [
    {
      difficulty: "again" as const,
      label: "Revisar",
      description: "Não lembrei",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      difficulty: "hard" as const,
      label: "Difícil",
      description: "Lembrei com dificuldade",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      difficulty: "good" as const,
      label: "Bom",
      description: "Lembrei corretamente",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      difficulty: "easy" as const,
      label: "Fácil",
      description: "Lembrei facilmente",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/app/flashcards")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Sessão de Revisão</h1>
            <p className="text-muted-foreground">
              Sistema de Repetição Espaçada (SRS - SM-2)
            </p>
          </div>
        </div>
      </div>

      {/* Progresso */}
      <Card>
        <CardContent className="py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                Flashcard {progress.current + 1} de {progress.total}
              </span>
              <span className="text-muted-foreground">
                {progress.percentage}% concluído
              </span>
            </div>
            <Progress value={progress.percentage} />
          </div>
        </CardContent>
      </Card>

      {/* Flashcard */}
      {currentFlashcard && (
        <FlashcardReviewCard
          flashcard={currentFlashcard}
          isFlipped={isFlipped}
          onClick={flipCard}
        />
      )}

      {/* Botões de Qualidade */}
      {isFlipped && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-lg">
              Como você avalia sua resposta?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {difficultyButtons.map((btn) => (
                <Button
                  key={btn.difficulty}
                  onClick={() => submitReview(btn.difficulty)}
                  disabled={isReviewing}
                  className={`${btn.color} text-white h-auto py-3 sm:py-4 flex flex-col items-center gap-1 min-w-0`}
                >
                  <span className="font-bold text-sm sm:text-base break-words text-center w-full px-1">
                    {btn.label}
                  </span>
                  <span className="text-xs opacity-90 break-words text-center w-full px-1 leading-tight">
                    {btn.description}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      {!isFlipped && (
        <Card className="max-w-2xl mx-auto bg-muted/50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <RotateCw className="h-5 w-5" />
              <p>
                Clique no card para virar e ver a resposta. Depois, avalie como
                você lembrou da resposta.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
