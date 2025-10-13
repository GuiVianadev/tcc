import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Brain, ClipboardList, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useDeleteMaterial } from "@/hooks/use-materials";
import { useMaterialFlashcards } from "@/hooks/use-flashcards";
import { useMaterialQuizzes, useQuizProgress } from "@/hooks/use-quizzes";
import { getSummary } from "@/api/summaries";
import { useQuery } from "@tanstack/react-query";

/**
 * Página de detalhes de um material
 *
 * Funcionalidades:
 * - Exibe resumo do material
 * - Lista flashcards e quizzes
 * - Mostra progresso de quizzes
 * - Links para estudar
 * - Opção de deletar material
 *
 * Exemplo de rota: /materials/:materialId
 */
export function MaterialDetail() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();

  // Queries
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["materials", materialId, "summary"],
    queryFn: () => getSummary(materialId!),
    enabled: !!materialId,
  });

  const { data: flashcards, isLoading: loadingFlashcards } =
    useMaterialFlashcards(materialId!);

  const { data: quizzes, isLoading: loadingQuizzes } = useMaterialQuizzes(
    materialId!
  );

  const { data: progress, isLoading: loadingProgress } = useQuizProgress(
    materialId!
  );

  const { mutate: deleteMaterial, isPending: isDeleting } =
    useDeleteMaterial();

  const [showSummary, setShowSummary] = useState(false);

  const handleDelete = () => {
    if (
      confirm("Tem certeza que deseja deletar este material? Esta ação não pode ser desfeita.")
    ) {
      deleteMaterial(materialId!, {
        onSuccess: () => {
          navigate("/materials");
        },
      });
    }
  };

  const isLoading =
    loadingSummary || loadingFlashcards || loadingQuizzes || loadingProgress;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{summary?.material_title || "Material"}</h1>
            <p className="text-muted-foreground">
              Criado em {summary && new Date(summary.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar Material
        </Button>
      </div>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Resumo
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSummary(!showSummary)}
            >
              {showSummary ? "Ocultar" : "Ver Resumo"}
            </Button>
          </div>
        </CardHeader>
        {showSummary && summary && (
          <CardContent>
            <p className="whitespace-pre-wrap">{summary.content}</p>
          </CardContent>
        )}
      </Card>

      {/* Cards de Status */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Flashcards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flashcards?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Para revisão espaçada (SRS)
            </p>
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => navigate(`/materials/${materialId}/flashcards`)}
            >
              Revisar Flashcards
            </Button>
          </CardContent>
        </Card>

        {/* Quizzes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progress?.studied_count || 0} / {progress?.total_quizzes || 0}
            </div>
            <p className="text-xs text-muted-foreground">questões estudadas</p>
            <Button
              className="w-full mt-4"
              onClick={() => navigate(`/materials/${materialId}/quizzes`)}
            >
              Fazer Quiz
            </Button>
          </CardContent>
        </Card>

        {/* Progresso */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            {progress?.is_completed && (
              <Badge variant="default" className="bg-green-500">
                Completo!
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progress?.progress_percentage || 0}%
            </div>
            <Progress
              value={progress?.progress_percentage || 0}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {progress?.remaining_count || 0} questões restantes
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Lista de Flashcards */}
      <Card>
        <CardHeader>
          <CardTitle>Flashcards Disponíveis</CardTitle>
          <CardDescription>
            Sistema de Repetição Espaçada (SRS - SM-2)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {flashcards && flashcards.length > 0 ? (
            <div className="space-y-2">
              {flashcards.slice(0, 5).map((flashcard) => (
                <div
                  key={flashcard.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{flashcard.question}</p>
                    <p className="text-xs text-muted-foreground">
                      Próxima revisão:{" "}
                      {new Date(flashcard.next_review).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>EF: {flashcard.easiness_factor.toFixed(1)}</span>
                    <span>Int: {flashcard.interval}d</span>
                    <span>Rep: {flashcard.repetitions}</span>
                  </div>
                </div>
              ))}
              {flashcards.length > 5 && (
                <p className="text-center text-sm text-muted-foreground">
                  E mais {flashcards.length - 5} flashcards...
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhum flashcard encontrado
            </p>
          )}
        </CardContent>
      </Card>

      {/* Lista de Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle>Quizzes Disponíveis</CardTitle>
          <CardDescription>
            Sessões de 10 questões para testar seu conhecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quizzes && quizzes.length > 0 ? (
            <div className="space-y-2">
              {quizzes.slice(0, 5).map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{quiz.question}</p>
                    <p className="text-xs text-muted-foreground">
                      {quiz.options.length} opções
                    </p>
                  </div>
                  {quiz.studied ? (
                    <Badge variant="outline" className="bg-green-50">
                      Estudado
                    </Badge>
                  ) : (
                    <Badge variant="outline">Novo</Badge>
                  )}
                </div>
              ))}
              {quizzes.length > 5 && (
                <p className="text-center text-sm text-muted-foreground">
                  E mais {quizzes.length - 5} quizzes...
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhum quiz encontrado
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}