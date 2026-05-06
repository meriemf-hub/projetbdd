import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/dashboard")({ component: DashboardLayout });

function DashboardLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading, nav]);
  if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Chargement…</div>;
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 gap-3 bg-background sticky top-0 z-10">
            <SidebarTrigger />
            <h1 className="font-semibold">Espace de gestion</h1>
          </header>
          <main className="flex-1 p-6 bg-muted/30"><Outlet /></main>
        </div>
      </div>
    </SidebarProvider>
  );
}
