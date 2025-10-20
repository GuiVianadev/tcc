import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMaterialSummary } from "@/hooks/use-summaries";
import { SummaryViewer } from "@/components/summaries/summary-viewer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Página de visualização de um resumo específico
 *
 * Features:
 * - Exibe resumo com suporte a Markdown
 * - Botão voltar para lista
 * - Link para o material original
 *
 * Rota: /summaries/:materialId
 */
export function SummaryDetail() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();

  const { data: summary, isLoading } = useMaterialSummary(materialId!);


  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">Resumo não encontrado</h2>
              <p className="text-muted-foreground">
                O resumo que você está procurando não existe ou foi removido
              </p>
              <Button onClick={() => navigate("/app/materials")}>
                Voltar para Resumos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/app/materials")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {summary.material_title || "Resumo"}
            </h1>
            {summary.created_at && (
              <p className="text-muted-foreground">
                Criado em {new Date(summary.created_at).toLocaleDateString()}
              </p>
            )}
          </div>

        </div>
      </div>
      {/* Resumo */}
      <SummaryViewer
        content={summary.content || "Sem conteúdo disponível"}
        title="Conteúdo do Resumo"
        showCopyButton
      />
    </div>

  );
}

