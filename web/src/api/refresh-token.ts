import { api } from "@/lib/axios";

interface RefreshTokenResponse {
  token: string;
}

/**
 * Faz refresh do access token usando o refresh token (httpOnly cookie)
 * Retorna o novo access token para ser armazenado em memória
 */
export async function refreshToken(): Promise<string> {
  const response = await api.patch<RefreshTokenResponse>("/users/token/refresh");
  const { token } = response.data;
  return token;
}