import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUsers, reactivateUser, type GetUsersParams } from "@/api/admin";

/**
 * Hook para listar usuários (admin only)
 *
 * Retorna query com dados paginados dos usuários.
 *
 * @param params - Parâmetros de paginação (page, pageSize)
 * @returns Query com lista de usuários paginada
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useAdminUsers({ page: 1, pageSize: 10 });
 *
 * if (isLoading) return <Skeleton />;
 * if (error) return <Error />;
 *
 * return (
 *   <Table>
 *     {data.users.map(user => <UserRow key={user.id} user={user} />)}
 *   </Table>
 * );
 * ```
 */
export function useAdminUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para soft delete de usuário (admin only)
 *
 * Retorna mutation que:
 * - Deleta usuário (soft delete)
 * - Invalida cache da lista de usuários
 * - Atualiza UI automaticamente
 *
 * @returns Mutation para deletar usuário
 *
 * @example
 * ```tsx
 * const { mutateAsync: deleteUserMutation, isPending } = useDeleteUser();
 *
 * async function handleDelete(userId: string) {
 *   await deleteUserMutation(userId);
 *   toast.success("Usuário removido com sucesso");
 * }
 * ```
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalida todas as queries de usuários para forçar refetch
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
export function useReactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactivateUser,
    onSuccess: () => {
      // Invalida todas as queries de usuários para forçar refetch
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
