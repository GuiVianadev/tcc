import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { queryClient } from "./lib/react-query";
import { router } from "./routes";

export function App() {
  return (
    <ThemeProvider storageKey="cognition-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
