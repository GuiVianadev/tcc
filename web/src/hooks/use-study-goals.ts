import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudyGoals, upsertStudyGoals, updateStudyGoals, type UpsertStudyGoalsRequest, type UpdateStudyGoalsRequest } from "@/api/study-goals";

/**
 * Hook para buscar metas de estudo do usuário
 */
export function useStudyGoals() {
  return useQuery({
    queryKey: ["study-goals"],
    queryFn: getStudyGoals,
    retry: false, // Não retentar se não encontrar (404)
  });
}

/**
 * Hook para criar/atualizar metas de estudo
 */
export function useUpsertStudyGoals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpsertStudyGoalsRequest) => upsertStudyGoals(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-goals"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });
}

/**
 * Hook para atualizar metas de estudo (PATCH)
 */
export function useUpdateStudyGoals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStudyGoalsRequest) => updateStudyGoals(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-goals"] });
      queryClient.invalidateQueries({ queryKey: ["studyGoals"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });
}