import { createContext, useCallback, useEffect, useState, useRef } from "react";
import { signIn as signInApi } from "@/api/sign-in";
import { signUp as signUpApi } from "@/api/sign-up";
import { logout as logoutApi } from "@/api/logout";
import { getCurrentUser } from "@/api/get-profile";
import { refreshToken } from "@/api/refresh-token";

// ========== TYPES ==========

export type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  is_first_access: boolean;
  created_at: string;
  updated_at: string | null;
};

type AuthContextData = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

// ========== CONTEXT ==========

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ========== PROVIDER ==========

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isAuthenticated = !!user;

  /**
   * Carrega os dados do usuário autenticado
   */
  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("@cognitio:token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      localStorage.removeItem("@cognitio:token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Recarrega os dados do usuário (útil após atualização de perfil)
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error("Erro ao recarregar usuário:", error);
    }
  }, []);

  /**
   * Realiza login
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Chama a API de login (já salva o token no localStorage)
      await signInApi({ email, password });

      // Carrega os dados do usuário
      const response = await getCurrentUser();
      setUser(response.user);

      // Retorna o usuário para que o componente possa fazer o redirect
      return response.user;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }, []);

  /**
   * Realiza registro
   */
  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        await signUpApi({ name, email, password });

        // Após registrar, faz login automaticamente
        await signIn(email, password);
      } catch (error) {
        console.error("Erro ao fazer registro:", error);
        throw error;
      }
    },
    [signIn]
  );

  /**
   * Realiza logout
   */
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setUser(null);

      // Limpa o intervalo de refresh ao fazer logout
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }
  }, []);

  /**
   * Inicia o refresh automático do token
   * Renova o token a cada 8 minutos (antes do token expirar em 10 minutos)
   */
  const setupTokenRefresh = useCallback(() => {
    // Limpa qualquer intervalo existente
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // Configura novo intervalo para renovar o token a cada 8 minutos
    refreshIntervalRef.current = setInterval(async () => {
      try {
        const token = localStorage.getItem("@cognitio:token");

        if (!token) {
          // Se não há token, limpa o intervalo
          if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
          }
          return;
        }

        console.log("[Auth] Renovando token automaticamente...");
        await refreshToken();
        console.log("[Auth] Token renovado com sucesso");
      } catch (error) {
        console.error("[Auth] Erro ao renovar token automaticamente:", error);

        // Se falhar ao renovar, faz logout
        await logout();
      }
    }, 8 * 60 * 1000); // 8 minutos em milissegundos
  }, [logout]);

  /**
   * Carrega o usuário ao montar o componente
   */
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Inicia o refresh automático quando o usuário está autenticado
   * e limpa quando o usuário faz logout
   */
  useEffect(() => {
    if (isAuthenticated) {
      setupTokenRefresh();
    } else {
      // Limpa o intervalo se o usuário não está autenticado
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }

    // Cleanup ao desmontar o componente
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, setupTokenRefresh]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        signIn,
        signUp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
