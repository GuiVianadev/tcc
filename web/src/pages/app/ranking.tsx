import { Trophy, Flame, Medal, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RankingUser {
  name: string;
  current_streak: number;
  total_study_days: number;
}

interface RankingResponse {
  users: RankingUser[];
}

async function fetchRanking(): Promise<RankingResponse> {
  const response = await api.get("/users/ranking/streak");
  return response.data;
}

/**
 * Página de Ranking de Usuários
 *
 * Exibe um ranking dos usuários ordenados por:
 * - Dias consecutivos de estudo (streak)
 * - Total de dias estudados
 *
 * Features:
 * - Top 3 destacados com medalhas
 * - Tabela completa com todos os usuários
 * - Indicador visual de posição
 */
export function Ranking() {
  const { data, isLoading } = useQuery({
    queryKey: ["ranking", "streak"],
    queryFn: fetchRanking,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  // Função para obter iniciais do nome
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Função para obter cor da medalha
  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-orange-600";
      default:
        return "text-muted-foreground";
    }
  };

  // Função para obter ícone da medalha
  const getMedalIcon = (position: number) => {
    if (position <= 3) {
      return <Medal className={`h-6 w-6 ${getMedalColor(position)}`} />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const users = data?.users || [];
  const topThree = users.slice(0, 3);
  const restOfUsers = users.slice(3);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Ranking de Consistência</h1>
          <p className="text-muted-foreground">
            Usuários com mais dias consecutivos de estudo
          </p>
        </div>
      </div>

      {/* Top 3 Destaque */}
      {topThree.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {topThree.map((user, index) => {
            const position = index + 1;
            const isFirst = position === 1;

            return (
              <Card
                key={index}
                className={`${isFirst ? "border-yellow-500 border-2 shadow-lg" : ""}`}
              >
                <CardHeader className="text-center pb-3">
                  <div className="flex justify-center mb-2">
                    {getMedalIcon(position)}
                  </div>
                  <div className="flex justify-center mb-3">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {position}º Lugar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Streak</span>
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-2xl font-bold text-orange-500">
                        {user.current_streak}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dias totais</span>
                    <span className="font-semibold">{user.total_study_days}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tabela Completa */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Completo</CardTitle>
          <CardDescription>
            Todos os usuários ordenados por dias consecutivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum usuário com atividades registradas ainda
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      Streak
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Dias Totais</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => {
                  const position = index + 1;
                  const isTopThree = position <= 3;

                  return (
                    <TableRow key={index} className={isTopThree ? "bg-muted/30" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {isTopThree ? (
                            getMedalIcon(position)
                          ) : (
                            <span className="text-muted-foreground">{position}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="text-sm">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{user.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={user.current_streak > 0 ? "default" : "outline"}
                          className={user.current_streak > 0 ? "bg-orange-500" : ""}
                        >
                          {user.current_streak} dias
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {user.total_study_days}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Dica de Consistência
          </CardTitle>
          <CardDescription>
            A consistência é mais importante que a intensidade. Estudar um pouco todos os dias é
            melhor que estudar muito em um único dia. Mantenha seu streak vivo!
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}