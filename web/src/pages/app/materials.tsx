import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, BookOpen, ClipboardList } from "lucide-react";
import { useMaterials, useDeleteMaterial } from "@/hooks/use-materials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Material } from "@/api/materials";

/**
 * Página de lista de materiais
 *
 * Funcionalidades:
 * - Listar todos os materiais do usuário
 * - Paginação
 * - Deletar material com confirmação
 * - Navegação para criação de novo material
 * - Empty state quando não há materiais
 */
export function Materials() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9); // 3x3 grid
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);

  const { data, isLoading, error } = useMaterials({ page, pageSize });
  const { mutateAsync: deleteMaterialMutation, isPending: isDeleting } = useDeleteMaterial();

  async function handleDeleteMaterial() {
    if (!materialToDelete) return;

    try {
      await deleteMaterialMutation(materialToDelete.id);
      setMaterialToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar material:", error);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function truncateContent(content: string, maxLength = 150) {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Erro ao carregar materiais. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Meus Materiais</h1>
          <p className="text-muted-foreground">
            Gerencie seus materiais de estudo
          </p>
        </div>
        <Button
          onClick={() => navigate("/materials/create")}
          className="bg-foreground"
        >
          Criar Material
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {data && data.materials.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 rounded-full bg-muted p-4">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-lg">Nenhum material criado</h3>
            <p className="mb-4 text-center text-muted-foreground text-sm">
              Comece criando seu primeiro material de estudo
            </p>
            <Button
              onClick={() => navigate("/materials/create")}
              className="bg-foreground"
            >
              Criar Primeiro Material
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Materials Grid */}
      {data && data.materials.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.materials.map((material) => (
              <Card key={material.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{material.title}</CardTitle>
                  <CardDescription>
                    Criado em {formatDate(material.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="mb-4 flex-1 text-muted-foreground text-sm">
                    {truncateContent(material.content)}
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/summaries/${material.id}`)}
                      >
                        <BookOpen className="mr-1 h-4 w-4" />
                        Resumo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/materials/${material.id}/flashcards`)}
                      >
                        <Brain className="mr-1 h-4 w-4" />
                        Cards
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/materials/${material.id}/quizzes`)}
                      >
                        <ClipboardList className="mr-1 h-4 w-4" />
                        Quizzes
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setMaterialToDelete(material)}
                    >
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              Mostrando {data.materials.length} de {data.total} materiais
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page * pageSize >= data.total}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!materialToDelete} onOpenChange={() => setMaterialToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a deletar o material <strong>{materialToDelete?.title}</strong>.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMaterial}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deletando..." : "Deletar material"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
