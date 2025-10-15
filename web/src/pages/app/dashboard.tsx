import { useQuery } from "@tanstack/react-query";
import { Book, Brain, Flame, RefreshCcw, ClipboardList, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/api/get-profile";
import { useUserStatistics } from "@/hooks/use-statistics";
import { useMaterials, useRecentMaterials } from "@/hooks/use-materials";
import { ChartBarInteractive } from "@/components/chart-bar-interactive";
import { ChartPieLabelCustom } from "@/components/chart-pie-label-custom";
import { DailyGoals } from "@/components/dashboard/daily-goals";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function Dashboard() {
  const navigate = useNavigate();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getCurrentUser,
  });

  const { data: statistics, isLoading: isLoadingStatistics } = useUserStatistics();
  const { data: materialsData, isLoading: isLoadingMaterials } = useRecentMaterials();

  return (
    <div className="m-auto flex max-w-[1440px] flex-col space-y-4">
      <div className="flex-shrink-0 space-y-2">
        <h1 className="flex items-center gap-1 font-semibold text-2xl tracking-tight sm:text-3xl">
          Olá,{" "}
          {isLoadingProfile ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            profile?.user.name
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
              {isLoadingStatistics ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                statistics?.current_streak || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {statistics?.current_streak === 1 ? "dia" : "dias"} consecutivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total de Materiais
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {isLoadingStatistics ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                statistics?.total_materials || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              materiais criados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Flashcards Revisados
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {isLoadingStatistics ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                statistics?.flashcard_stats?.total_reviews || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              revisões totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Quizzes Respondidos
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {isLoadingStatistics ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                statistics?.quiz_stats?.total_attempts || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {statistics?.quiz_stats?.accuracy_percentage
                ? `${statistics.quiz_stats.accuracy_percentage.toFixed(1)}% de acerto`
                : "acertos"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartBarInteractive />
        <ChartPieLabelCustom />

      </div>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Materiais Recentes</CardTitle>
              <CardDescription>Seus últimos materiais criados</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/materials")}
            >
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingMaterials ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : materialsData && materialsData.materials.length > 0 ? (
              <div className="space-y-3">
                {materialsData.materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => navigate(`/materials`)}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{material.title}</h4>
                      <p className="text-muted-foreground text-xs">
                        Criado em {new Date(material.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/summaries/${material.id}`);
                        }}
                      >
                        <Book className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/materials/${material.id}/flashcards`);
                        }}
                      >
                        <Brain className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/materials/${material.id}/quizzes`);
                        }}
                      >
                        <ClipboardList className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground text-center">
                  Você ainda não criou nenhum material
                </p>
                <Button
                  className="mt-4"
                  onClick={() => navigate("/materials/create")}
                >
                  Criar primeiro material
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <DailyGoals />
      </div>
    </div>
  );
}
