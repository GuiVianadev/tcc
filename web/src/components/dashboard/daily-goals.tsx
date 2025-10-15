import { Target, Brain, ClipboardList } from "lucide-react";
import { useStudyGoals } from "@/hooks/use-study-goals";
import { useUserStatistics } from "@/hooks/use-statistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Componente que exibe as metas diárias e o progresso atual
 *
 * Mostra:
 * - Meta de flashcards revisados hoje vs objetivo
 * - Meta de quizzes completados hoje vs objetivo
 * - Progresso visual com barra
 */
export function DailyGoals() {
  const { data: goals, isLoading: isLoadingGoals } = useStudyGoals();
  const { data: statistics, isLoading: isLoadingStats } = useUserStatistics();

  const isLoading = isLoadingGoals || isLoadingStats;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas Diárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!goals) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas Diárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground text-sm">
            Configure suas metas no onboarding
          </div>
        </CardContent>
      </Card>
    );
  }

  const flashcardsToday = statistics?.flashcards_reviewed_today || 0;
  const quizzesToday = statistics?.quizzes_completed_today || 0;

  const flashcardsGoal = goals.daily_flashcards_goal;
  const quizzesGoal = goals.daily_quizzes_goal;

  const flashcardsProgress = Math.min((flashcardsToday / flashcardsGoal) * 100, 100);
  const quizzesProgress = Math.min((quizzesToday / quizzesGoal) * 100, 100);

  const flashcardsCompleted = flashcardsToday >= flashcardsGoal;
  const quizzesCompleted = quizzesToday >= quizzesGoal;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Metas Diárias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Meta de Flashcards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className={`h-4 w-4 ${flashcardsCompleted ? "text-green-600" : "text-purple-600"}`} />
              <span className="font-medium text-sm">Flashcards</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {flashcardsToday} / {flashcardsGoal}
            </span>
          </div>
          <Progress
            value={flashcardsProgress}
            className={flashcardsCompleted ? "bg-green-100" : ""}
          />
          {flashcardsCompleted && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              ✓ Meta concluída!
            </p>
          )}
        </div>

        {/* Meta de Quizzes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className={`h-4 w-4 ${quizzesCompleted ? "text-green-600" : "text-blue-600"}`} />
              <span className="font-medium text-sm">Quizzes</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {quizzesToday} / {quizzesGoal}
            </span>
          </div>
          <Progress
            value={quizzesProgress}
            className={quizzesCompleted ? "bg-green-100" : ""}
          />
          {quizzesCompleted && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              ✓ Meta concluída!
            </p>
          )}
        </div>

        {/* Área de interesse */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Estudando:</span> {goals.area_of_interest}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}