import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

/**
 * Hook para acessar o contexto de autenticação
 *
 * Exemplo de uso:
 * ```tsx
 * const { user, isAuthenticated, signIn, logout } = useAuth();
 *
 * if (!isAuthenticated) {
 *   return <LoginPage />;
 * }
 *
 * return <div>Olá, {user?.name}!</div>;
 * ```
 *
 * @throws Error se usado fora do AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}