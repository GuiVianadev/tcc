import axios from "axios";
import { env } from "@/env";

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@cognitio:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para lidar com token expirado e fazer refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se for 401 e não for a rota de refresh nem já tentou fazer refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/users/token/refresh"
    ) {
      if (isRefreshing) {
        // Se já está fazendo refresh, adiciona na fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tenta fazer refresh do token usando o httpOnly cookie
        const response = await api.patch<{ token: string }>(
          "/users/token/refresh"
        );
        const { token } = response.data;

        // Salva o novo token
        localStorage.setItem("@cognitio:token", token);

        // Atualiza o token na requisição original
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Processa a fila de requisições que falharam
        processQueue(null, token);

        return api(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar, desloga o usuário
        processQueue(refreshError, null);
        localStorage.removeItem("@cognitio:token");

        if (window.location.pathname !== "/sign-in") {
          window.location.href = "/sign-in";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
