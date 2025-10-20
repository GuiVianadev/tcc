import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Search } from "lucide-react";
import { useMaterials } from "@/hooks/use-materials";
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
 * Página de listagem de materiais com flashcards
 *
 * Features:
 * - Lista todos materiais que têm flashcards
 * - Busca por título do material
 * - Navegação para flashcards do material
 * - Layout similar à página de resumos
 *
 * Rota: /flashcards
 */
export function Flashcards() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(1);

  const { data: materialsData, isLoading } = useMaterials({ page, pageSize: 50 });

  // Garantir que materials seja um array
  const materialsArray = materialsData?.materials || [];

  // Filtrar materiais pelo termo de busca
  const filteredMaterials = materialsArray.filter((material) => {
    const search = searchTerm.toLowerCase();
    return material.title.toLowerCase().includes(search);
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="space-y-4">
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
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8" />
            Flashcards
          </h1>
          <p className="text-muted-foreground">
            Selecione um material para revisar seus flashcards
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Materiais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{materialsArray.length}</div>
          <p className="text-xs text-muted-foreground">materiais com flashcards</p>
        </CardContent>
      </Card>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título do material..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Materiais */}
      {filteredMaterials && filteredMaterials.length > 0 ? (
        <div className="space-y-4">
          {filteredMaterials.map((material) => (
            <Card
              key={material.id}
              className="hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/materials/${material.id}/flashcards`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <CardDescription>
                      Criado em {new Date(material.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Brain className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : searchTerm ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <Search className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">Nenhum material encontrado</h3>
              <p className="text-sm text-muted-foreground">
                Tente buscar com outros termos
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum material disponível</CardTitle>
            <CardDescription>
              Crie um material para gerar flashcards automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/app/materials/create")}>
              Criar Primeiro Material
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
