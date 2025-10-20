import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { queryClient } from "./lib/react-query";
import { router } from "./routes";
import { Toaster } from "sonner";

// Fallback de loading para lazy-loaded routes
function PageLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider storageKey="cognition-theme">
      <Toaster richColors />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<PageLoadingFallback />}>
            <RouterProvider router={router} />
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
