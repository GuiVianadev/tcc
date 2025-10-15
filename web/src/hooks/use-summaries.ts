import { useQuery } from "@tanstack/react-query";
import { getSummaries, getSummary, getSummaryById } from "@/api/summaries";

/**
 * Hook para listar todos os resumos do usuário
 *
 * @param page - Número da página (padrão: 1)
 * @returns Query com lista de resumos
 *
 * @example
 * ```tsx
 * const { data: summaries, isLoading } = useSummaries(1);
 *
 * if (isLoading) return <Skeleton />;
 *
 * return (
 *   <div>
 *     {summaries?.map(summary => (
 *       <SummaryCard key={summary.id} summary={summary} />
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useSummaries(page = 1) {
  return useQuery({
    queryKey: ["summaries", page],
    queryFn: () => getSummaries(page),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para buscar o resumo de um material específico
 *
 * @param materialId - ID do material
 * @returns Query com resumo do material
 *
 * @example
 * ```tsx
 * const { data: summary, isLoading } = useMaterialSummary(materialId);
 *
 * if (isLoading) return <Skeleton />;
 *
 * return <SummaryViewer content={summary.content} />;
 * ```
 */
export function useMaterialSummary(materialId: string) {
  return useQuery({
    queryKey: ["materials", materialId, "summary"],
    queryFn: () => getSummary(materialId),
    enabled: !!materialId,
    staleTime: 1000 * 60 * 10, // 10 minutos (resumos mudam raramente)
  });
}

/**
 * Hook para buscar um resumo específico por ID
 *
 * @param summaryId - ID do resumo
 * @returns Query com resumo específico
 *
 * @example
 * ```tsx
 * const { data: summary, isLoading } = useSummaryById(summaryId);
 *
 * if (isLoading) return <Skeleton />;
 *
 * return <SummaryViewer content={summary.content} />;
 * ```
 */
export function useSummaryById(summaryId: string) {
  return useQuery({
    queryKey: ["summaries", summaryId],
    queryFn: () => getSummaryById(summaryId),
    enabled: !!summaryId,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}
