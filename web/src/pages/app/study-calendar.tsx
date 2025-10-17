import { ChevronLeft, ChevronRight, } from "lucide-react";
import { useState } from "react";
import { useUserStatistics } from "@/hooks/use-statistics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Função para determinar cor baseada na intensidade
  const getActivityColor = (count: number) => {
    if (count === 0) return 'bg-muted/30';
    if (count > 1) return 'bg-green-300/70 dark:bg-green-900/80';
    return 'bg-green-800 dark:bg-green-500';
  };

  // Navegação de mês
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calcular estatísticas do mês atual
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

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
                  Clique nas setas para navegar entre os meses
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
                  onClick={goToToday}
                >
                  Hoje
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
              <div className="grid grid-cols-7 gap-2 mx-auto ">
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
                  const today = isToday(dayInfo.date);

                  return (
                    <div
                      key={index}
                      className={`
                      relative aspect-square p-2 rounded-lg border transition-all
                      ${dayInfo.isCurrentMonth ? 'border-border' : 'border-transparent'}
                      ${today ? 'ring-2 ring-green-600' : ''}
                      ${activityCount > 0 ? 'cursor-pointer hover:scale-105' : ''}
                      ${getActivityColor(activityCount)}
                    `}
                      title={activityCount > 0 ? `${activityCount} atividades` : 'Sem atividades'}
                    >
                      <div className={`
                      text-sm font-medium text-center
                      ${dayInfo.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                      ${activityCount > 0 ? 'font-bold' : ''}
                    `}>
                        {dayInfo.day}
                      </div>
                      {activityCount > 0 && (
                        <div className="absolute bottom-1 left-0 right-0 text-center hidden lg:inline">
                          <span className="text-xs">
                            Atividades: {activityCount}
                          </span>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Legenda */}
              <div className="flex items-center justify-between pt-4 border-t">

                <div className="text-sm text-muted-foreground">
                  Streak atual: <span className="font-bold text-orange-500">{stats.current_streak} dias</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}