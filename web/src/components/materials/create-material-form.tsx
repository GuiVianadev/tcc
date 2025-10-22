import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMaterial } from "@/hooks/use-materials";

/**
 * Formulário para criar um novo material
 *
 * Funcionalidades:
 * - Criar com tópico (IA gera conteúdo)
 * - Criar com arquivo (PDF, DOCX, TXT, PNG, JPG)
 * - Criar vazio
 * - Loading states
 * - Validação básica
 */
export function CreateMaterialForm() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { mutate: createMaterial, isPending } = useCreateMaterial();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Por favor, insira um título");
      return;
    }

    createMaterial(
      {
        title: title.trim(),
        topic: topic.trim() || null,
        file: file || null,
      },
      {
        onSuccess: () => {
          // Reseta o formulário
          setTitle("");
          setTopic("");
          setFile(null);
          alert("Material criado com sucesso!");
        },
        onError: (error: any) => {
          console.error("Erro ao criar material:", error);

          // Tratamento específico para erro de IA sobrecarregada
          const errorMessage = error?.response?.data?.message || error?.message || "";
          const statusCode = error?.response?.status;

          if (statusCode === 503 || errorMessage.toLowerCase().includes("overload")) {
            alert(
              "A IA está temporariamente sobrecarregada. Por favor, aguarde alguns minutos e tente novamente.\n\n" +
              "Dica: Tente em um horário de menor uso ou reduza o tamanho do conteúdo."
            );
          } else if (statusCode === 429) {
            alert(
              "Você atingiu o limite de requisições. Por favor, aguarde alguns minutos antes de tentar novamente."
            );
          } else if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
            alert(
              "O processamento está demorando mais que o esperado. Tente novamente com um conteúdo menor ou em outro momento."
            );
          } else if (errorMessage) {
            alert(`Erro ao criar material: ${errorMessage}`);
          } else {
            alert(
              "Erro ao criar material. Verifique sua conexão e tente novamente.\n\n" +
              "Se o problema persistir, entre em contato com o suporte."
            );
          }
        },
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Valida tipo de arquivo
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/png",
        "image/jpeg",
      ];

      if (!validTypes.includes(selectedFile.type)) {
        alert("Tipo de arquivo não suportado. Use PDF, DOCX, TXT, PNG ou JPG");
        return;
      }

      setFile(selectedFile);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Material</CardTitle>
        <CardDescription>
          A IA irá gerar automaticamente resumo, flashcards e quizzes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ex: React Hooks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          {/* Tópico */}
          <div className="space-y-2">
            <Label htmlFor="topic">Tópico (opcional)</Label>
            <Textarea
              id="topic"
              placeholder="Ex: Introdução aos React Hooks, useState e useEffect"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isPending}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              A IA usará este tópico para gerar o conteúdo
            </p>
          </div>

          {/* OU divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou
              </span>
            </div>
          </div>

          {/* Upload de arquivo */}
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo (opcional)</Label>
            <div className="flex gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                disabled={isPending}
                className="flex-1"
              />
              {file && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFile(null)}
                  disabled={isPending}
                >
                  Remover
                </Button>
              )}
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: {file.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Suporta: PDF, DOCX, TXT, PNG, JPG
            </p>
          </div>

          {/* Informação */}
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">O que será gerado:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>1 resumo completo</li>
              <li>10 flashcards para revisão (Sistema SRS)</li>
              <li>15 quizzes de múltipla escolha</li>
            </ul>
          </div>

          {/* Botão de submit */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando conteúdo com IA...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Criar Material
              </>
            )}
          </Button>

          {isPending && (
            <p className="text-xs text-center text-muted-foreground">
              Isso pode levar alguns segundos...
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
