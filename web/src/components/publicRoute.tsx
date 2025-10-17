import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Se é primeiro acesso, redireciona para onboarding
    if (user.is_first_access) {
      return <Navigate to="/onboarding" replace />;
    }
    // Se é admin, redireciona para área administrativa
    if (user.role === "admin") {
      return <Navigate to="/admin/users" replace />;
    }
    // Caso contrário, redireciona para dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
