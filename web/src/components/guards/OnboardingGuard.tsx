import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

/**
 * Guard para forçar onboarding em primeiro acesso
 *
 * Se o usuário tem is_first_access = true, redireciona para /onboarding.
 * Isso garante que usuários novos passem pelo fluxo de configuração inicial.
 *
 * Exemplo de uso:
 * ```tsx
 * <Route
 *   path="/dashboard"
 *   element={
 *     <OnboardingGuard>
 *       <Dashboard />
 *     </OnboardingGuard>
 *   }
 * />
 * ```
 */
export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Aguarda carregamento
  if (isLoading) {
    return null; // Ou skeleton
  }

  // Se não estiver autenticado, o ProtectedRoute já vai redirecionar
  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Se é primeiro acesso, força onboarding
  if (user.is_first_access) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}