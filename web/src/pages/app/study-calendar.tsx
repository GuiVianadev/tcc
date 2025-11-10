import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useState } from "react";
import { useUserStatistics } from "@/hooks/use-statistics";
import type { UpcomingReview } from "@/api/user-statistics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * Página de Calendário de Estudo
 *
 * Exibe um calendário mensal real mostrando:
 * - Dias do mês com indicador de atividade
 * - Navegação entre meses
 * - Intensidade de estudo por dia (quantidade de atividades)
 * - Estatísticas mensais
 */
export function StudyCalendar() {
  const { data: stats, isLoading } = useUserStatistics();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedReview, setSelectedReview] = useState<UpcomingReview | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleDayClick = (dateStr: string) => {
    const review = stats?.upcoming_reviews.find(r => r.date === dateStr);
    if (review) {
      setSelectedReview(review);
      setIsSheetOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Criar mapa de atividades por data
  const activityMap = new Map<string, number>();
  stats.recent_activity.forEach((activity) => {
    const totalActivity = activity.flashcards_reviewed + activity.quizzes_completed;
    activityMap.set(activity.date, totalActivity);
  });

  // Criar mapa de revisões pendentes por data
  const upcomingReviewsMap = new Map<string, number>();
  stats.upcoming_reviews.forEach((review) => {
    upcomingReviewsMap.set(review.date, review.flashcards_due);
  });

  // Função para gerar dias do calendário do mês atual
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Domingo

    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Dias do mês anterior para preencher o início
    const prevMonthDays = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Dias do mês atual
    const currentMonthDays = [];
    for (let day = 1; day <= totalDays; day++) {
      currentMonthDays.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      });
    }

    // Dias do próximo mês para completar a grid
    const totalCells = prevMonthDays.length + currentMonthDays.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const nextMonthDays = [];
    for (let day = 1; day <= remainingCells; day++) {
      nextMonthDays.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day),
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const calendarDays = generateCalendarDays();

  // Função para determinar cor baseada na intensidade de atividade
  const getActivityColor = (count: number) => {
    if (count === 0) return 'bg-muted/30';
    if (count > 1) return 'bg-green-300/70 dark:bg-green-900/80';
    return 'bg-green-800 dark:bg-green-500';
  };

  // Função para determinar a borda baseada em revisões pendentes
  const getReviewBorderClass = (reviewCount: number) => {
    if (reviewCount === 0) return '';
    if (reviewCount >= 10) return 'ring-2 ring-red-500 ring-offset-2';
    if (reviewCount >= 5) return 'ring-2 ring-orange-500 ring-offset-2';
    return 'ring-2 ring-blue-500 ring-offset-2';
  };

  // Navegação de mês
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calcular estatísticas do mês atual
  let monthlyActivities = 0;
  let monthlyDaysStudied = 0;

  calendarDays.forEach(({ date, isCurrentMonth }) => {
    if (isCurrentMonth) {
      const dateStr = date.toISOString().split('T')[0];
      const count = activityMap.get(dateStr) || 0;
      if (count > 0) {
        monthlyDaysStudied++;
        monthlyActivities += count;
      }
    }
  });

  const monthlyAverage = monthlyDaysStudied > 0 ? Math.round(monthlyActivities / monthlyDaysStudied) : 0;

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Calendário de Estudo</h1>
        <p className="text-muted-foreground">
          Acompanhe sua consistência de estudos
        </p>
      </div>

      {/* Layout Principal: Estatísticas + Calendário */}
      <div className="grid gap-6 lg:grid-rows">
        {/* Estatísticas Mensais (Lateral) */}
        <div className="grid lg:grid-cols-3 gap-2">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Dias Estudados</CardDescription>
              <CardTitle className="text-3xl">{monthlyDaysStudied}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Atividades</CardDescription>
              <CardTitle className="text-3xl">{monthlyActivities}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Média/Dia</CardDescription>
              <CardTitle className="text-3xl">{monthlyAverage}</CardTitle>
            </CardHeader>
          </Card>


        </div>

        {/* Calendário */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <CardDescription>
                  Clique na data para mais detalhes
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Grid do Calendário */}
              <div className="grid grid-cols-7 gap-1.5 mx-auto max-w-3xl">
                {/* Cabeçalho dos dias da semana */}
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}

                {/* Dias do mês */}
                {calendarDays.map((dayInfo, index) => {
                  const dateStr = dayInfo.date.toISOString().split('T')[0];
                  const activityCount = activityMap.get(dateStr) || 0;
                  const reviewCount = upcomingReviewsMap.get(dateStr) || 0;
                  const today = isToday(dayInfo.date);

                  // Criar título do tooltip
                  let tooltipText = '';
                  if (activityCount > 0) {
                    tooltipText += `${activityCount} atividade${activityCount > 1 ? 's' : ''} realizada${activityCount > 1 ? 's' : ''}`;
                  }
                  if (reviewCount > 0) {
                    if (tooltipText) tooltipText += ' | ';
                    tooltipText += `${reviewCount} flashcard${reviewCount > 1 ? 's' : ''} para revisar`;
                  }
                  if (!tooltipText) tooltipText = 'Sem atividades ou revisões';

                  return (
                    <div
                      key={index}
                      onClick={() => reviewCount > 0 ? handleDayClick(dateStr) : null}
                      className={`
                      relative aspect-square p-1.5 rounded-md border transition-all
                      ${dayInfo.isCurrentMonth ? 'border-border' : 'border-transparent'}
                      ${today && !reviewCount ? 'ring-2 ring-green-600' : ''}
                      ${activityCount > 0 || reviewCount > 0 ? 'cursor-pointer hover:scale-105' : ''}
                      ${getActivityColor(activityCount)}
                      ${!today && getReviewBorderClass(reviewCount)}
                    `}
                      title={tooltipText}
                    >
                      <div className={`
                      text-xs font-medium text-center
                      ${dayInfo.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                      ${activityCount > 0 ? 'font-bold' : ''}
                    `}>
                        {dayInfo.day}
                      </div>

                      {/* Indicador de atividades realizadas */}
                      {activityCount > 0 && (
                        <div className="absolute bottom-0.5 left-0 right-0 text-center hidden xl:inline">
                          <span className="text-[10px]">
                            {activityCount}
                          </span>
                        </div>
                      )}

                      {/* Indicador de revisões pendentes */}
                      {reviewCount > 0 && (
                        <div className="absolute bottom-6 right-3.5 md:bottom-0.5 md:right-0.5">
                          <div className={`
                            w-5 h-4 rounded-full flex items-center justify-center text-[10px] font-bold
                            ${reviewCount >= 10 ? 'bg-red-500 text-white' :
                              reviewCount >= 5 ? 'bg-orange-500 text-white' :
                                'bg-blue-500 text-white'}
                          `}>
                            {reviewCount > 9 ? '9+' : reviewCount}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legenda */}
              <div className="space-y-3 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Streak atual: <span className="font-bold text-orange-500">{stats.current_streak} dias</span>
                </div>

                {/* Legenda de indicadores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-800 dark:bg-green-500" />
                    <span>Atividades realizadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span>Revisões pendentes (1-4)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500" />
                    <span>Revisões pendentes (5-9)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span>Revisões pendentes (10+)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sheet com detalhes das revisões (mobile-friendly) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] sm:h-auto sm:max-h-[85vh]">
          <SheetHeader>
            <SheetTitle>Revisões Pendentes</SheetTitle>
            <SheetDescription>
              {selectedReview && (
                <>
                  {new Date(selectedReview.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </>
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4 p-3">
            {selectedReview && selectedReview.materials.length > 0 ? (
              <>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm font-medium">Total de flashcards:</span>
                  <span className="text-lg font-bold text-primary">{selectedReview.flashcards_due}</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">Materiais:</h4>
                  {selectedReview.materials.map((material) => (
                    <Card key={material.material_id} className="hover:bg-accent/50 transition-colors">
                      <CardHeader className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base truncate">
                              {material.material_title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {material.flashcards_count} flashcard{material.flashcards_count > 1 ? 's' : ''} para revisar
                            </CardDescription>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                              {material.flashcards_count}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Nenhuma revisão pendente para este dia
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}