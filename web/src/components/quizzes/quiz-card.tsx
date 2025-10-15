import { type Quiz, type QuizOption } from "@/api/quizzes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  quiz: Quiz;
  selectedAnswer: string | null;
  onSelectAnswer: (optionId: string) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctAnswer: string | null;
}

/**
 * Componente de Quiz com opções de múltipla escolha
 *
 * Features:
 * - Exibe pergunta e opções
 * - Permite selecionar uma opção
 * - Mostra feedback visual (correto/incorreto)
 * - Destaca resposta correta após submissão
 * - Badge com informações do material
 *
 * @example
 * ```tsx
 * <QuizCard
 *   quiz={currentQuiz}
 *   selectedAnswer={selectedAnswer}
 *   onSelectAnswer={selectAnswer}
 *   isAnswered={isAnswered}
 *   isCorrect={isCorrect}
 *   correctAnswer={correctAnswer}
 * />
 * ```
 */
export function QuizCard({
  quiz,
  selectedAnswer,
  onSelectAnswer,
  isAnswered,
  isCorrect,
  correctAnswer,
}: QuizCardProps) {
  const getOptionStyle = (option: QuizOption) => {
    // Se ainda não respondeu, apenas mostra selecionado
    if (!isAnswered) {
      return selectedAnswer === option.id
        ? "border-primary bg-primary/10"
        : "hover:border-primary/50";
    }

    // Se já respondeu, mostra feedback
    const isThisCorrect = option.id === correctAnswer;
    const isThisSelected = option.id === selectedAnswer;

    if (isThisCorrect) {
      return "border-green-500 bg-green-50 dark:bg-green-950";
    }

    if (isThisSelected && !isCorrect) {
      return "border-red-500 bg-red-50 dark:bg-red-950";
    }

    return "opacity-50";
  };

  const getOptionIcon = (option: QuizOption) => {
    if (!isAnswered) return null;

    const isThisCorrect = option.id === correctAnswer;
    const isThisSelected = option.id === selectedAnswer;

    if (isThisCorrect) {
      return <Check className="h-5 w-5 text-green-600" />;
    }

    if (isThisSelected && !isCorrect) {
      return <X className="h-5 w-5 text-red-600" />;
    }

    return null;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        {quiz.material_title && (
          <Badge variant="outline" className="mb-4 w-fit">
            {quiz.material_title}
          </Badge>
        )}
        <CardTitle className="text-2xl leading-relaxed">
          {quiz.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quiz.options?.map((option) => (
          <button
            key={option.id}
            onClick={() => !isAnswered && onSelectAnswer(option.id)}
            disabled={isAnswered}
            className={cn(
              "w-full text-left p-4 rounded-lg border-2 transition-all",
              "flex items-center justify-between gap-3",
              getOptionStyle(option),
              !isAnswered && "cursor-pointer"
            )}
          >
            <span className="flex-1">{option.text}</span>
            {getOptionIcon(option)}
          </button>
        ))}

        {/* Feedback após resposta */}
        {isAnswered && (
          <div className="mt-6 pt-6 border-t">
            {isCorrect ? (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <Check className="h-5 w-5" />
                <span>Resposta correta! Parabéns!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <X className="h-5 w-5" />
                  <span>Resposta incorreta</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  A resposta correta está destacada em verde.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
