import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ChevronUp,
  Inbox,
  LayoutDashboardIcon,
  Settings,
  User2,
  FolderOpen,
  BookOpen,
  Brain,
  ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/api/get-profile";
import { logout } from "@/api/logout";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "../assets/logo-CognitioAI.svg?react";
import { Navlink } from "./nav-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

const items = [
  {
    title: "Dashboard",
    url: "",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Materiais",
    url: "materials",
    icon: FolderOpen,
  },
  {
    title: "Resumos",
    url: "summaries",
    icon: BookOpen,
  },
  {
    title: "Flashcards",
    url: "flashcards",
    icon: Brain,
  },
  {
    title: "Quizzes",
    url: "quizzes",
    icon: ClipboardList,
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getCurrentUser,
  });

  const navigate = useNavigate();

  const { mutateAsync: signOutfn, isPending: isSigningOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate("/sign-in", { replace: true });
    },
  });

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem className="left-3">
            <Logo className="h-10 w-30 fill-black dark:fill-white" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Navlink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Navlink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="rounded-2xl border p-2 dark:border-zinc-800 dark:bg-black">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />{" "}
                  {isLoadingProfile ? (
                    <Skeleton className="h-4 w-40" />
                  ) : (
                    profile?.user.name
                  )}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-popper-anchor-width]"
                side="top"
              >
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer text-red-500 transition-all hover:bg-red-300/30"
                  disabled={isSigningOut}
                >
                  <button className="w-full" onClick={() => signOutfn()}>
                    <span>Sign out</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
