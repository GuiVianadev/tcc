import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Filter } from "lucide-react";
import { useSummaries } from "@/hooks/use-summaries";
import { SummaryCard } from "@/components/summaries/summary-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Página de listagem de todos os resumos
 *
 * Features:
 * - Lista todos resumos do usuário
 * - Busca por título/conteúdo
 * - Paginação
 * - Navegação para visualizar resumo específico
 *
 * Rota: /summaries
 */
export function Summaries() {
  const navigate = useNavigate();
  const [page] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: summaries, isLoading } = useSummaries(page);

  // Garantir que summaries seja um array (caso backend retorne objeto com propriedade)
  const summariesArray = Array.isArray(summaries)
    ? summaries
    : summaries?.summaries
    ? summaries.summaries
    : [];

  // Filtrar resumos pelo termo de busca
  const filteredSummaries = summariesArray.filter((summary) => {
    const search = searchTerm.toLowerCase();
    return (
      summary.material_title?.toLowerCase().includes(search) ||
      summary.content?.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="space-y-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Resumos
          </h1>
          <p className="text-muted-foreground">
            Todos os resumos gerados dos seus materiais
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Lista de Resumos */}
      {filteredSummaries && filteredSummaries.length > 0 ? (
        <div className="space-y-4">
          {filteredSummaries.map((summary) => (
            <SummaryCard
              key={summary.id}
              summary={summary}
              onViewDetails={() => navigate(`/summaries/${summary.material_id}`)}
              showPreview
            />
          ))}
        </div>
      ) : searchTerm ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <Search className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">Nenhum resumo encontrado</h3>
              <p className="text-sm text-muted-foreground">
                Tente buscar com outros termos
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum resumo disponível</CardTitle>
            <CardDescription>
              Crie um material para gerar resumos automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/materials/create")}>
              Criar Primeiro Material
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
