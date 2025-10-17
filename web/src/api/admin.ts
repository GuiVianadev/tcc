import { api } from "@/lib/axios";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  is_first_access: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface PaginatedUsersResponse {
  users: PublicUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
}

export interface DeleteUserRequest {
  targetUserId: string;
}

/**
 * Lista todos os usuários (admin only)
 *
 * @param params - Parâmetros de paginação (page, pageSize)
 * @returns Promise<PaginatedUsersResponse>
 *
 * Endpoint: GET /users
 * Auth: Required (JWT + Admin role)
 */
export async function getUsers(params: GetUsersParams = {}): Promise<PaginatedUsersResponse> {
  const { page = 1, pageSize = 10 } = params;

  const response = await api.get<PaginatedUsersResponse>("/users", {
    params: { page, pageSize },
  });

  return response.data;
}

/**
 * Soft delete de um usuário (admin only)
 *
 * @param targetUserId - ID do usuário a ser deletado
 * @returns Promise<void>
 *
 * Endpoint: DELETE /users/delete
 * Auth: Required (JWT)
 *
 * Nota: O backend verifica se o usuário requisitante tem permissão
 */
export async function deleteUser(targetUserId: string): Promise<void> {
  await api.delete("/users/delete", {
    data: { targetUserId },
  });
}
export async function reactivateUser(targetUserId: string): Promise<void> {
  await api.patch("/users/reactivate", {
    targetUserId,
  });
}
