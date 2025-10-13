import { api } from "@/lib/axios";

export interface UpdateUserProfileRequest {
  name?: string;
  email?: string;
  password?: string;
  is_first_access?: boolean;
}

/**
 * Atualiza o perfil do usuário autenticado
 *
 * @param data - Dados para atualizar (name, email, password, is_first_access)
 * @returns Promise<void>
 *
 * Endpoint: PATCH /user/update
 * Auth: Required (JWT)
 */
export async function updateUserProfile(data: UpdateUserProfileRequest): Promise<void> {
  await api.patch("/user/update", data);
}
