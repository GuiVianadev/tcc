import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteMaterial, useMaterials } from "@/hooks/use-materials";

/**
 * Componente de exemplo para listar materiais
 *
 * Funcionalidades:
 * - Lista todos os materiais do usuário
 * - Permite deletar materiais
 * - Loading states automáticos
 * - Atualização automática após deletar
 */
export function MaterialList() {
  const { data: materials, isLoading } = useMaterials();
  const { mutate: deleteMaterial, isPending: isDeleting } =
    useDeleteMaterial();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Nenhum material encontrado</p>
          <Button className="mt-4">Criar Primeiro Material</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {materials.map((material) => (
        <Card key={material.id}>
          <CardHeader>
            <CardTitle>{material.title}</CardTitle>
            <CardDescription>
              Criado em {new Date(material.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <a href={`/materials/${material.id}`}>Ver Material</a>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteMaterial(material.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
