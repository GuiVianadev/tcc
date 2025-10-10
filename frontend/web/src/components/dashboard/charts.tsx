import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudyActivity, useStudyDistribution } from "@/api/queries/dashboard";
import { ChartBarInteractive } from "@/components/chart-bar-interactive";

export function StudyActivityChart() {
  const { data: activity, isLoading, error } = useStudyActivity(30);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividade de Estudo (30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividade de Estudo (30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-red-500">
            Erro ao carregar dados
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activity || activity.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividade de Estudo (30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Nenhum dado de estudo disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preparar dados para o gráfico
  const chartData = activity.map(item => ({
    date: new Date(item.date).toLocaleDateString('pt-BR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    cards: item.cards_studied,
    time: item.study_time,
    accuracy: item.accuracy
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade de Estudo (30 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartBarInteractive data={chartData} />
      </CardContent>
    </Card>
  );
}

export function StudyDistributionChart() {
  const { data: distribution, isLoading, error } = useStudyDistribution();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Matéria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Matéria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-red-500">
            Erro ao carregar dados
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!distribution || distribution.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Matéria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Nenhum dado de distribuição disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preparar dados para o gráfico de pizza
  const totalCards = distribution.reduce((sum, item) => sum + item.cards_count, 0);
  const totalTime = distribution.reduce((sum, item) => sum + item.study_time, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Matéria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {distribution.map((item, index) => {
            const percentage = totalCards > 0 ? (item.cards_count / totalCards) * 100 : 0;
            const timePercentage = totalTime > 0 ? (item.study_time / totalTime) * 100 : 0;
            
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)` 
                    }}
                  />
                  <span className="text-sm font-medium">{item.subject}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {item.cards_count} cards ({percentage.toFixed(1)}%)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.study_time} min ({timePercentage.toFixed(1)}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
