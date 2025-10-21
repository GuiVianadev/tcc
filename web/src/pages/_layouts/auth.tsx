import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col justify-center antialiased bg-zinc-950 overflow-x-hidden">
      <div className="flex h-full flex-col justify-between rounded-r-lg border-foreground/5 p-10 text-muted-foreground md:border-r ">
        <div className="flex items-center justify-center gap-3 text-foreground text-lg md:justify-normal">
          <img className="absolute mx-auto top-0 left-1/2 transform -translate-x-1/2 z-0 object-contain max-w-full" src="/images/top.webp" alt="Background decoration" />
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full max-w-full px-4">
        <Outlet />
      </div>
    </div>
  );
}
