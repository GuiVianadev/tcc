import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { Dashboard } from "./pages/app/dashboard";
import { Decks } from "./pages/app/decks";
import { Settings } from "./pages/app/settings";
import { Simulados } from "./pages/app/simulados";
import { Materials } from "./pages/app/materials";
import { CreateMaterial } from "./pages/app/create-material";
import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";
import { ProtectedRoute } from "./components/protectedRoute";
import { PublicRoute } from "./components/publicRoute";
import { OnboardingGuard } from "./components/guards/OnboardingGuard";
import { AdminGuard } from "./components/guards/AdminGuard";
import { Onboarding } from "./pages/app/onboarding";
import { AdminUsers } from "./pages/admin/users";

export const router = createBrowserRouter([
  // Rotas protegidas (requerem autenticação + onboarding completo)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <OnboardingGuard>
          <AppLayout />
        </OnboardingGuard>
      </ProtectedRoute>
    ),
    children: [
      { path: "/", Component: Dashboard },
      { path: "/dashboard", Component: Dashboard },
      { path: "/materials", Component: Materials },
      { path: "/materials/create", Component: CreateMaterial },
      { path: "/decks", Component: Decks },
      { path: "/simulados", Component: Simulados },
      { path: "/settings", Component: Settings },
    ],
  },
  // Rota de onboarding (apenas autenticação, sem OnboardingGuard para evitar loop)
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    ),
  },
  // Rotas de administração (requerem autenticação + role admin)
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <OnboardingGuard>
          <AdminGuard>
            <AppLayout />
          </AdminGuard>
        </OnboardingGuard>
      </ProtectedRoute>
    ),
    children: [
      { path: "/admin/users", Component: AdminUsers },
    ],
  },
  // Rotas públicas (redirecionam se autenticado)
  {
    path: "/",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { path: "/sign-in", Component: SignIn },
      { path: "/sign-up", Component: SignUp },
    ],
  },
]);
