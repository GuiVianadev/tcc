import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { CreateDeck } from "./pages/app/create-deck";
import { Dashboard } from "./pages/app/dashboard";
import { Deck } from "./pages/app/deck";
import { Decks } from "./pages/app/decks";
import { Settings } from "./pages/app/settings";
import { Simulados } from "./pages/app/simulados";
import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { path: "/", Component: Dashboard },
      { path: "/decks", Component: Decks },
      { path: "/simulados", Component: Simulados },
      { path: "/settings", Component: Settings },
      { path: "/decks/create/:id", Component: CreateDeck },
      { path: "/decks/:id", Component: Deck },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "/sign-in", Component: SignIn },
      { path: "/sign-up", Component: SignUp },
    ],
  },
]);
