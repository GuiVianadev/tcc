import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, ClipboardList } from "lucide-react";
import { useMaterialQuizzes } from "@/hooks/use-quizzes";
import { useQuizSession } from "@/hooks/use-quiz-session";
import { QuizCard } from "@/components/quizzes/quiz-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Página de sessão de quizzes de um material específico
 *
 * Features:
 * - Carrega quizzes de um material
 * - Sistema de múltipla escolha
 * - Feedback visual (correto/incorreto)
 * - Botão "Próximo" após responder
 * - Progresso da sessão
 *
 * Rota: /materials/:materialId/quizzes
 */
export function MaterialQuizzes() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();

  const { data: quizzes, isLoading } = useMaterialQuizzes(materialId!);

  const {
    currentQuiz,
    selectedAnswer,
    isAnswered,
    isCorrect,
    correctAnswer,
    progress,
    isSessionComplete,
    isSubmitting,
    selectAnswer,
    submitAnswer,
    nextQuiz,
  } = useQuizSession(quizzes || []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full max-w-3xl mx-auto" />
      </div>
    );
  }

  // Nenhum quiz no material
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-bold">Nenhum quiz disponível</h2>
              <p className="text-muted-foreground">
                Este material ainda não tem quizzes gerados.
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
                quizzes respondidos com sucesso
              </p>
            </div>

            <div className="pt-6 border-t space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Continue praticando para fixar o conhecimento!
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
            <h1 className="text-2xl font-bold">Sessão de Quiz</h1>
            <p className="text-muted-foreground">
              {currentQuiz?.material_title || "Material"}
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
                Quiz {progress.current + 1} de {progress.total}
              </span>
              <span className="text-muted-foreground">
                {progress.percentage}% concluído
              </span>
            </div>
            <Progress value={progress.percentage} />
          </div>
        </CardContent>
      </Card>

      {/* Quiz */}
      {currentQuiz && (
        <QuizCard
          quiz={currentQuiz}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={selectAnswer}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          correctAnswer={correctAnswer}
        />
      )}

      {/* Botões de Ação */}
      <div className="flex justify-center gap-4">
        {!isAnswered ? (
          <Button
            onClick={submitAnswer}
            disabled={!selectedAnswer || isSubmitting}
            size="lg"
            className="min-w-[200px]"
          >
            {isSubmitting ? "Enviando..." : "Responder"}
          </Button>
        ) : (
          <Button
            onClick={nextQuiz}
            size="lg"
            className="min-w-[200px]"
          >
            Próximo Quiz
          </Button>
        )}
      </div>

      {/* Instruções */}
      {!isAnswered && !selectedAnswer && (
        <Card className="max-w-2xl mx-auto bg-muted/50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ClipboardList className="h-5 w-5" />
              <p>
                Selecione uma das opções acima e clique em "Responder" para ver
                o resultado.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
