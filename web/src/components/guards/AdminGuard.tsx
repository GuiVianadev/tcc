import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Guard para proteger rotas de administrador
 *
 * Verifica se o usuário está autenticado E tem role de admin.
 * Se não for admin, redireciona para o dashboard.
 *
 * Exemplo de uso:
 * ```tsx
 * <Route
 *   path="/admin"
 *   element={
 *     <AdminGuard>
 *       <AdminPage />
 *     </AdminGuard>
 *   }
 * />
 * ```
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Aguarda carregamento
  if (isLoading) {
    return null; // Ou skeleton
  }

  // Se não estiver autenticado, o ProtectedRoute já vai redirecionar
  // Mas por segurança, verificamos aqui também
  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Verifica se é admin
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}