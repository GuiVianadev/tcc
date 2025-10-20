import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Aguarda carregamento com skeleton para evitar flash branco
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
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