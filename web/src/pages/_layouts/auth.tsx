import { Outlet } from "react-router-dom";
import Logo from "../../assets/logo-CognitioAI.svg?react";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col justify-center antialiased md:grid md:grid-cols-2">
      <div className="flex h-full flex-col justify-between rounded-r-lg border-foreground/5 p-10 text-muted-foreground md:border-r md:bg-[url(/src/assets/bg-auth.png)] md:bg-cover md:bg-muted md:bg-no-repeat">
        <div className="flex items-center justify-center gap-3 text-foreground text-lg md:justify-normal">
          <Logo className="h-10 w-46 fill-blue-800 md:fill-white" />
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
