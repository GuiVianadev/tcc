import { api } from "@/lib/axios";

export type RegisterBody = {
  email: string;
  full_name: string;
  username: string;
  password: string;
  field_of_study?: string;
  learning_goals?: string;
  preferred_language?: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type UserResponse = {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  field_of_study?: string;
  learning_goals?: string;
  preferred_language: string;
  is_active: boolean;
  is_verified: boolean;
  is_premium: boolean;
  total_cards_studied: number;
  current_streak: number;
  longest_streak: number;
  experience_points: number;
  level: number;
  created_at: string;
  last_login?: string;
  settings: Record<string, any>;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type LogoutResponse = {
  message: string;
};

export async function register(data: RegisterBody) {
  const response = await api.post<UserResponse>("/api/v1/auth/register", data);
  return response.data;
}

export async function login({
  email,
  password,
}: LoginBody) {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post<TokenResponse>("/api/v1/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get<UserResponse>("/api/v1/auth/me");
  return response.data;
}

export async function refreshToken() {
  const response = await api.post<TokenResponse>("/api/v1/auth/refresh");
  return response.data;
}

export async function refreshTokenFromCookie() {
  const response = await api.post<TokenResponse>("/api/v1/auth/refresh-token");
  return response.data;
}

export async function logout() {
  const response = await api.post<LogoutResponse>("/api/v1/auth/logout");
  return response.data;
}
