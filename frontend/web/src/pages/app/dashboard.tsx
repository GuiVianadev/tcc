import { useQuery } from "@tanstack/react-query";
import {
  Book,
  Brain,
  Flame,
  GoalIcon,
  RefreshCcw,
  Timer,
  TrendingUp,
} from "lucide-react";
import { getCurrentUser } from "@/api/auth";
import { getStatistics } from "@/api/queries/get-statistics";
import { ChartBarInteractive } from "@/components/chart-bar-interactive";
import { ChartPieLabelCustom } from "@/components/chart-pie-label-custom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function Dashboard() {
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getCurrentUser,
  });

  const { data: statistics, isLoading: isLoadingStatistics } = useQuery({
    queryKey: ["statistics"],
    queryFn: getStatistics,
  });

  return (
    <div className="m-auto flex max-w-[1440px] flex-col space-y-4">
      <div className="flex-shrink-0 space-y-2">
        <h1 className="flex items-center gap-1 font-semibold text-2xl tracking-tight sm:text-3xl">
          Olá,{" "}
          {isLoadingProfile ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            profile?.username
          )}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Bem-vindo de volta ao seu painel de estudos
        </p>
      </div>

      <div className="grid flex-shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Sequência Diária
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {" "}
              {isLoadingStatistics ? (
                <Skeleton className="h-6 w-40" />
              ) : (
                statistics?.current_streak
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Cards Estudados
            </CardTitle>
            <Brain className="bg- h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {" "}
              {isLoadingStatistics ? (
                <Skeleton className="h-6 w-40" />
              ) : (
                statistics?.total_cards_studied
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total de Decks
            </CardTitle>
            <Book className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {" "}
              {isLoadingStatistics ? (
                <Skeleton className="h-6 w-40" />
              ) : (
                statistics?.total_decks
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total de Revisões
            </CardTitle>
            <RefreshCcw className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {" "}
              {isLoadingStatistics ? (
                <Skeleton className="h-6 w-40" />
              ) : (
                statistics?.total_reviews
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <ChartBarInteractive />
        <ChartPieLabelCustom />
      </div>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cards recentes</CardTitle>
            <CardDescription>Seus decks mais estudados</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <span className="text-sm">Conteudo não encontrado</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Metas de estudo</CardTitle>
            <CardDescription>Seu progresso semanal</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <span className="text-sm">Conteudo não encontrado</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
