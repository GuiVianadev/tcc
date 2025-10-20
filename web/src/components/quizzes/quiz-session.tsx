import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnswerQuiz, useQuizSession } from "@/hooks/use-quizzes";
import type { Quiz } from "@/api/quizzes";
import { Alert } from "@/components/ui/alert";

interface QuizSessionProps {
  materialId: string;
}

/**
 * Componente completo de sessão de quiz
 *
 * Funcionalidades:
 * - Carrega 10 questões não estudadas
 * - Permite responder uma por vez
 * - Mostra feedback imediato (correto/errado)
 * - Barra de progresso da sessão
 * - Estatísticas ao final (acertos/erros)
 * - Atualização automática do progresso no backend
 */
export function QuizSession({ materialId }: QuizSessionProps) {
  const { data: session, isLoading } = useQuizSession(materialId);
  const { mutate: answerQuiz, isPending } = useAnswerQuiz();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
  } | null>(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!session || session.quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <p className="text-lg font-semibold">Parabéns!</p>
          <p className="text-muted-foreground">
            Você já completou todos os quizzes deste material
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentQuiz: Quiz = session.quizzes[currentIndex];
  const progress = ((currentIndex + 1) / session.quizzes.length) * 100;
  const isLastQuestion = currentIndex === session.quizzes.length - 1;

  const handleAnswer = (optionId: string) => {
    if (result) return; // Já respondeu
    setSelectedAnswer(optionId);

    answerQuiz(
      {
        quizId: currentQuiz.id,
        selectedAnswer: optionId,
      },
      {
        onSuccess: (response) => {
          setResult(response);
          setStats((prev) => ({
            correct: prev.correct + (response.isCorrect ? 1 : 0),
            incorrect: prev.incorrect + (response.isCorrect ? 0 : 1),
          }));
        },
      }
    );
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Sessão completa - mostrar estatísticas
      return;
    }

    // Próxima questão
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setResult(null);
  };

  // Mostrar estatísticas finais
  if (isLastQuestion && result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sessão Completa!</CardTitle>
          <CardDescription>Confira seu desempenho</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stats.correct}</p>
                    <p className="text-sm text-muted-foreground">Acertos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stats.incorrect}</p>
                    <p className="text-sm text-muted-foreground">Erros</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold">
                Acurácia:{" "}
                {Math.round(
                  (stats.correct / (stats.correct + stats.incorrect)) * 100
                )}
                %
              </p>
            </div>

            <Button className="w-full" onClick={() => window.location.reload()}>
              Continuar Estudando
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>
            Questão {currentIndex + 1} de {session.quizzes.length}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {stats.correct} acertos
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg font-medium">{currentQuiz.question}</p>

          <div className="space-y-2">
            {currentQuiz.options?.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.id === currentQuiz.correct_answer;
              const showFeedback = result !== null;

              let variant: "outline" | "default" | "destructive" = "outline";
              if (showFeedback) {
                if (isCorrect) variant = "default";
                else if (isSelected && !isCorrect) variant = "destructive";
              }

              return (
                <Button
                  key={option.id}
                  variant={variant}
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleAnswer(option.id)}
                  disabled={isPending || showFeedback}
                >
                  <span className="font-semibold mr-2">
                    {option.id.toUpperCase()})
                  </span>
                  {option.text}
                </Button>
              );
            })}
          </div>

          {result && (
            <Alert
              variant={result.isCorrect ? "default" : "destructive"}
              className="mt-4"
            >
              {result.isCorrect ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Correto! Continue assim!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <span>
                    Incorreto. A resposta correta é:{" "}
                    {result.correctAnswer.toUpperCase()}
                  </span>
                </div>
              )}
            </Alert>
          )}

          {result && (
            <Button className="w-full" onClick={handleNext}>
              {isLastQuestion ? "Ver Resultado" : "Próxima Questão"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
