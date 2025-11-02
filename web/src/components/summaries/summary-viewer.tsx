import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import 'github-markdown-css/github-markdown-light.css';
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
        <div className="markdown-body text-foreground" style={{
          backgroundColor: 'transparent',
          color: 'hsl(var(--foreground))'
        }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}