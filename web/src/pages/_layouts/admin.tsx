import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/sidebar";
import { ModeToggle } from "@/components/theme/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full antialiased">
        <div>
          <AdminSidebar />
        </div>
        <SidebarInset>
          <main className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between p-5">
              <SidebarTrigger />
              <ModeToggle />
            </div>
            <div className="mx-auto w-full p-8 py-6 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
