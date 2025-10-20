import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/api/users";
import { useAuth } from "./useAuth";

/**
 * Hook para atualizar perfil do usuário
 *
 * Retorna mutation que:
 * - Atualiza dados do usuário no backend
 * - Invalida cache do perfil
 * - Atualiza contexto de autenticação
 *
 * @example
 * ```tsx
 * const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
 *
 * await updateProfile({ is_first_access: false });
 * ```
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async () => {
      // Atualiza contexto de autenticação com dados mais recentes
      await refreshUser();

      // Invalida queries relacionadas ao usuário
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
