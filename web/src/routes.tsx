import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { Dashboard } from "./pages/app/dashboard";
import { ProtectedRoute } from "./components/protectedRoute";
import { PublicRoute } from "./components/publicRoute";
import { OnboardingGuard } from "./components/guards/OnboardingGuard";
import { AdminGuard } from "./components/guards/AdminGuard";
import { LandingPage } from "./pages/landing-page/landing-page";

// Lazy load - Rotas de autenticação (carregadas sob demanda)
const SignIn = lazy(() => import("./pages/auth/sign-in").then(m => ({ default: m.SignIn })));
const SignUp = lazy(() => import("./pages/auth/sign-up").then(m => ({ default: m.SignUp })));

// Lazy load - Rotas secundárias (carregadas sob demanda)
const Settings = lazy(() => import("./pages/app/settings").then(m => ({ default: m.Settings })));
const Materials = lazy(() => import("./pages/app/materials").then(m => ({ default: m.Materials })));
const CreateMaterial = lazy(() => import("./pages/app/create-material").then(m => ({ default: m.CreateMaterial })));
const Summaries = lazy(() => import("./pages/app/summaries").then(m => ({ default: m.Summaries })));
const SummaryDetail = lazy(() => import("./pages/app/summary-detail").then(m => ({ default: m.SummaryDetail })));
const Flashcards = lazy(() => import("./pages/app/flashcards").then(m => ({ default: m.Flashcards })));
const FlashcardReview = lazy(() => import("./pages/app/flashcard-review").then(m => ({ default: m.FlashcardReview })));
const MaterialFlashcards = lazy(() => import("./pages/app/material-flashcards").then(m => ({ default: m.MaterialFlashcards })));
const Quizzes = lazy(() => import("./pages/app/quizzes").then(m => ({ default: m.Quizzes })));
const MaterialQuizzes = lazy(() => import("./pages/app/material-quizzes").then(m => ({ default: m.MaterialQuizzes })));
const StudyCalendar = lazy(() => import("./pages/app/study-calendar").then(m => ({ default: m.StudyCalendar })));
const Ranking = lazy(() => import("./pages/app/ranking").then(m => ({ default: m.Ranking })));
const Onboarding = lazy(() => import("./pages/app/onboarding").then(m => ({ default: m.Onboarding })));

// Lazy load - Rotas administrativas
const AdminUsers = lazy(() => import("./pages/admin/users").then(m => ({ default: m.AdminUsers })));
const AdminLayout = lazy(() => import("./pages/_layouts/admin").then(m => ({ default: m.AdminLayout })));

export const router = createBrowserRouter([
  // Landing Page - Rota pública raiz (/)
  {
    path: "/",
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },

  // Rotas de autenticação (sign-in, sign-up)
  {
    path: "/sign-in",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { index: true, Component: SignIn },
    ],
  },
  {
    path: "/sign-up",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { index: true, Component: SignUp },
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

  // Rotas protegidas (requerem autenticação + onboarding completo)
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <OnboardingGuard>
          <AppLayout />
        </OnboardingGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "materials", Component: Materials },
      { path: "materials/create", Component: CreateMaterial },
      { path: "materials/:materialId/flashcards", Component: MaterialFlashcards },
      { path: "materials/:materialId/quizzes", Component: MaterialQuizzes },
      { path: "summaries", Component: Summaries },
      { path: "summaries/:materialId", Component: SummaryDetail },
      { path: "flashcards", Component: Flashcards },
      { path: "flashcards/review", Component: FlashcardReview },
      { path: "quizzes", Component: Quizzes },
      { path: "calendar", Component: StudyCalendar },
      { path: "ranking", Component: Ranking },
      { path: "settings", Component: Settings },
    ],
  },

  // Rotas de administração (requerem autenticação + role admin)
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <OnboardingGuard>
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        </OnboardingGuard>
      </ProtectedRoute>
    ),
    children: [
      { path: "users", Component: AdminUsers },
    ],
  },
]);
