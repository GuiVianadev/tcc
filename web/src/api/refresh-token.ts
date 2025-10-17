import { api } from "@/lib/axios";

interface RefreshTokenResponse {
  token: string;
}

export async function refreshToken(): Promise<string> {
  const response = await api.patch<RefreshTokenResponse>("/users/token/refresh");

  const { token } = response.data;

  localStorage.setItem("@cognitio:token", token);

  return token;
}