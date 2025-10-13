import { BookOpen, Brain, CheckCircle2, Flame } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStatistics } from "@/hooks/use-statistics";

/**
 * Componente de estatísticas do usuário
 *
 * Exibe:
 * - Total de materiais, flashcards e quizzes
 * - Atividade de hoje
 * - Streak de estudo
 * - Acurácia em quizzes
 * - Estatísticas de flashcards (SRS)
 */
export function UserStatistics() {
  const { data: stats, isLoading } = useUserStatistics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Cards principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiais</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_materials}</div>
            <p className="text-xs text-muted-foreground">
              Total de materiais criados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_flashcards}</div>
            <p className="text-xs text-muted-foreground">
              {stats.flashcards_reviewed_today} revisões hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_quizzes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.quizzes_completed_today} completados hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.current_streak}</div>
            <p className="text-xs text-muted-foreground">dias consecutivos</p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas detalhadas */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Flashcards */}
        <Card>
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
            <CardDescription>Sistema de Repetição Espaçada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total de revisões</span>
              <span className="font-semibold">
                {stats.flashcard_stats.total_reviews}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Qualidade média</span>
              <span className="font-semibold">
                {stats.flashcard_stats.average_quality.toFixed(1)} / 5.0
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Dominados</span>
                <span className="font-medium">
                  {stats.flashcard_stats.mastered_count}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-yellow-600">Aprendendo</span>
                <span className="font-medium">
                  {stats.flashcard_stats.learning_count}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Novos</span>
                <span className="font-medium">
                  {stats.flashcard_stats.new_count}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quizzes */}
        <Card>
          <CardHeader>
            <CardTitle>Quizzes</CardTitle>
            <CardDescription>Desempenho geral</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total de tentativas</span>
              <span className="font-semibold">
                {stats.quiz_stats.total_attempts}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Acertos</span>
              <span className="font-semibold text-green-600">
                {stats.quiz_stats.correct_attempts}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Acurácia</span>
              <span className="text-2xl font-bold">
                {stats.quiz_stats.accuracy_percentage}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Tempo médio</span>
              <span className="font-semibold">
                {stats.quiz_stats.average_time_per_quiz}s
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividade recente */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recent_activity.map((activity) => (
              <div
                key={activity.date}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <span className="text-sm">
                  {new Date(activity.date).toLocaleDateString("pt-BR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <div className="flex gap-4 text-sm">
                  <span>
                    {activity.flashcards_reviewed} flashcards
                  </span>
                  <span>
                    {activity.quizzes_completed} quizzes
                  </span>
                  <span className="text-muted-foreground">
                    {activity.study_time_minutes}min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
