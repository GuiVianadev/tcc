import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Brain } from "lucide-react";
import { useMaterialFlashcards } from "@/hooks/use-flashcards";
import { useFlashcardReview } from "@/hooks/use-flashcard-review";
import { FlashcardReviewCard } from "@/components/flashcards/flashcard-review-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Página de revisão de flashcards de um material específico
 *
 * Features:
 * - Carrega flashcards de um material
 * - Sistema de revisão com flip
 * - Botões de dificuldade (again, hard, good, easy)
 * - Progresso da sessão
 *
 * Rota: /materials/:materialId/flashcards
 */
export function MaterialFlashcards() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();

  const { data: flashcards, isLoading } = useMaterialFlashcards(materialId!);

  const {
    currentFlashcard,
    isFlipped,
    progress,
    isSessionComplete,
    isReviewing,
    againQueueCount,
    flipCard,
    submitReview,
  } = useFlashcardReview(flashcards || []);


  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
      </div>
    );
  }

  // Nenhum flashcard no material
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Brain className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-bold">Nenhum flashcard disponível</h2>
              <p className="text-muted-foreground">
                Este material ainda não tem flashcards gerados.
              </p>
              <Button onClick={() => navigate("/app/materials")}>
                Voltar para Materiais
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
              <Zap className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
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
                memória de longo prazo.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => navigate("/app/materials")}
                  variant="outline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Materiais
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
            onClick={() => navigate("/app/materials")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Revisão de Flashcards</h1>
            <p className="text-muted-foreground">
              {currentFlashcard?.material_title || "Material"}
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
            {againQueueCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 pt-1">
                <span className="font-semibold">{againQueueCount}</span>
                <span>card{againQueueCount > 1 ? 's' : ''} para revisar novamente</span>
              </div>
            )}
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

      {/* Botões de Dificuldade */}
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
                  className={`${btn.color} text-white h-auto py-4 flex flex-col items-center gap-1`}
                >
                  <span className="font-bold">{btn.label}</span>
                  <span className="text-xs opacity-90">{btn.description}</span>
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
              <Brain className="h-5 w-5" />
              <p>
                Clique no card para virar e ver a resposta. Depois, avalie a
                dificuldade da sua resposta.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
