import { useState } from "react";
import { Copy, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Summary } from "@/api/summaries";

interface SummaryCardProps {
  summary: Summary;
  onViewDetails?: () => void;
  showPreview?: boolean;
}

/**
 * Card para exibir resumo com funcionalidade de copiar
 *
 * Features:
 * - Botão copiar com feedback visual
 * - Botão "Ver Detalhes" (opcional)
 * - Preview do conteúdo (truncado ou completo)
 * - Data de criação
 *
 * @example
 * ```tsx
 * <SummaryCard
 *   summary={summary}
 *   onViewDetails={() => navigate(`/summaries/${summary.id}`)}
 *   showPreview
 * />
 * ```
 */
export function SummaryCard({
  summary,
  onViewDetails,
  showPreview = true,
}: SummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  // Truncar conteúdo para preview (primeiros 200 caracteres)
  const contentPreview = showPreview && summary.content && summary.content.length > 200
    ? summary.content.substring(0, 200) + "..."
    : summary.content || "Sem conteúdo disponível";

  return (
    <Card
      className="hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={onViewDetails}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">
              {summary.material_title || "Resumo"}
            </CardTitle>
            <CardDescription>
              Criado em {new Date(summary.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); // Previne navegação ao clicar em copiar
                handleCopy();
              }}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar
                </>
              )}
            </Button>
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {contentPreview}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
