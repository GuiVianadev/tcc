import { useQuery } from "@tanstack/react-query";
import { getUserStatistics } from "@/api/user-statistics";

/**
 * Hook para buscar estatísticas completas do usuário
 *
 * Retorna informações sobre:
 * - Materiais, flashcards e quizzes totais
 * - Atividade diária (revisões e quizzes hoje)
 * - Streak de estudo (dias consecutivos)
 * - Estatísticas detalhadas de flashcards (SRS)
 * - Estatísticas detalhadas de quizzes (acertos/erros)
 * - Histórico de atividades recentes
 *
 * Exemplo de uso:
 * ```tsx
 * const { data: stats, isLoading } = useUserStatistics();
 *
 * if (isLoading) return <Skeleton />;
 *
 * return (
 *   <div>
 *     <p>Total de materiais: {stats.total_materials}</p>
 *     <p>Streak atual: {stats.current_streak} dias</p>
 *     <p>Acurácia: {stats.quiz_stats.accuracy_percentage}%</p>
 *   </div>
 * );
 * ```
 */
export function useUserStatistics() {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: getUserStatistics,
    // Recarrega a cada 1 minuto para manter atualizado
    refetchInterval: 60 * 1000,
  });
}
