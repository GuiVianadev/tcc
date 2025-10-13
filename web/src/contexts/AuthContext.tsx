import { createContext, useCallback, useEffect, useState } from "react";
import { signIn as signInApi } from "@/api/sign-in";
import { signUp as signUpApi } from "@/api/sign-up";
import { logout as logoutApi } from "@/api/logout";
import { getCurrentUser } from "@/api/get-profile";

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
  signIn: (email: string, password: string) => Promise<void>;
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
    }
  }, []);

  /**
   * Carrega o usuário ao montar o componente
   */
  useEffect(() => {
    loadUser();
  }, [loadUser]);

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
