import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { Dashboard } from "./pages/app/dashboard";
import { Settings } from "./pages/app/settings";
import { Materials } from "./pages/app/materials";
import { CreateMaterial } from "./pages/app/create-material";
import { Summaries } from "./pages/app/summaries";
import { SummaryDetail } from "./pages/app/summary-detail";
import { Flashcards } from "./pages/app/flashcards";
import { FlashcardReview } from "./pages/app/flashcard-review";
import { MaterialFlashcards } from "./pages/app/material-flashcards";
import { Quizzes } from "./pages/app/quizzes";
import { MaterialQuizzes } from "./pages/app/material-quizzes";
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
      { path: "/materials/:materialId/flashcards", Component: MaterialFlashcards },
      { path: "/materials/:materialId/quizzes", Component: MaterialQuizzes },
      { path: "/summaries", Component: Summaries },
      { path: "/summaries/:materialId", Component: SummaryDetail },
      { path: "/flashcards", Component: Flashcards },
      { path: "/flashcards/review", Component: FlashcardReview },
      { path: "/quizzes", Component: Quizzes },
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
