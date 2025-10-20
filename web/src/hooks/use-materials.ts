import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMaterialFromTopic,
  createMaterialFromFile,
  deleteMaterial,
  getMaterials,
  type CreateMaterialFromTopicRequest,
  type CreateMaterialFromFileRequest,
  type GetMaterialsParams,
  getRecentMaterials,
} from "@/api/materials";

/**
 * Hook para listar materiais do usuário com paginação
 *
 * @param params - Parâmetros de paginação (page, pageSize)
 * @returns Query com dados paginados
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useMaterials({ page: 1, pageSize: 10 });
 *
 * if (isLoading) return <Skeleton />;
 *
 * return (
 *   <div>
 *     {data.materials.map(material => (
 *       <MaterialCard key={material.id} material={material} />
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useMaterials(params: GetMaterialsParams = {}) {
  return useQuery({
    queryKey: ["materials", params],
    queryFn: () => getMaterials(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useRecentMaterials() {
  return useQuery({
    queryKey: ["recentMaterials"],
    queryFn: () => getRecentMaterials(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para criar material a partir de tópico
 *
 * Gera material completo com IA:
 * - Conteúdo
 * - Resumo
 * - Flashcards
 * - Quizzes
 *
 * @example
 * ```tsx
 * const { mutateAsync, isPending } = useCreateMaterialFromTopic();
 *
 * await mutateAsync({
 *   title: "React Hooks",
 *   topic: "Introdução aos React Hooks",
 *   flashcardsQuantity: 10,
 *   quizzesQuantity: 5,
 * });
 * ```
 */
export function useCreateMaterialFromTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaterialFromTopicRequest) =>
      createMaterialFromTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

/**
 * Hook para criar material a partir de arquivo
 *
 * Extrai conteúdo e gera:
 * - Resumo
 * - Flashcards
 * - Quizzes
 *
 * Suporta: PDF, DOCX, TXT, PNG, JPG (max 10MB)
 *
 * @example
 * ```tsx
 * const { mutateAsync, isPending } = useCreateMaterialFromFile();
 *
 * await mutateAsync({
 *   title: "Apostila React",
 *   file: selectedFile,
 *   flashcardsQuantity: 15,
 * });
 * ```
 */
export function useCreateMaterialFromFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaterialFromFileRequest) =>
      createMaterialFromFile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

/**
 * Hook para criar material (unificado)
 *
 * Decide automaticamente se cria a partir de tópico ou arquivo
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateMaterial();
 *
 * // Com tópico
 * mutate({ title: "React", topic: "Intro to hooks" });
 *
 * // Com arquivo
 * mutate({ title: "React", file: pdfFile });
 * ```
 */
export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; topic?: string | null; file?: File | null; flashcardsQuantity?: number; quizzesQuantity?: number }) => {
      if (data.file) {
        return createMaterialFromFile({
          title: data.title,
          file: data.file,
          flashcardsQuantity: data.flashcardsQuantity,
          quizzesQuantity: data.quizzesQuantity,
        });
      } else if (data.topic) {
        return createMaterialFromTopic({
          title: data.title,
          topic: data.topic,
          flashcardsQuantity: data.flashcardsQuantity,
          quizzesQuantity: data.quizzesQuantity,
        });
      }
      throw new Error("É necessário fornecer um tópico ou um arquivo");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

/**
 * Hook para deletar um material
 *
 * @example
 * ```tsx
 * const { mutateAsync, isPending } = useDeleteMaterial();
 * await mutateAsync(materialId);
 * ```
 */
export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materialId: string) => deleteMaterial(materialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}