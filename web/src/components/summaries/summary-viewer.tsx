import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryViewerProps {
  content: string;
  title?: string;
  showCopyButton?: boolean;
}

/**
 * Componente para visualizar resumo com suporte a Markdown
 *
 * Features:
 * - Renderiza Markdown (via react-markdown)
 * - Suporta GitHub Flavored Markdown (tabelas, tasklists, etc)
 * - Botão de copiar opcional
 * - Estilização customizada para dark mode
 *
 * @example
 * ```tsx
 * <SummaryViewer
 *   title="Resumo do Material"
 *   content={summary.content}
 *   showCopyButton
 * />
 * ```
 */
export function SummaryViewer({
  content,
  title = "Resumo",
  showCopyButton = true,
}: SummaryViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {showCopyButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
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
          )}
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden px-4 sm:px-6">
        <div className="prose prose-sm leading-relaxed w-full max-w-full dark:prose-invert
          prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
          prose-p:leading-loose prose-p:break-words prose-p:w-full
          prose-pre:bg-muted prose-pre:text-muted-foreground prose-pre:p-3 prose-pre:rounded-lg
          prose-pre:w-full prose-pre:max-w-full prose-pre:overflow-x-auto
          prose-code:text-sm prose-code:break-words
          prose-table:block prose-table:w-full prose-table:max-w-full prose-table:overflow-x-auto
          [&_pre]:w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:box-border
          [&_pre_code]:whitespace-pre [&_pre_code]:text-sm
          [&_p_code]:break-words [&_p_code]:whitespace-normal
          [&_*]:max-w-full break-words">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}