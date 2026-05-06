import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, GraduationCap, Bus, MapPin, Route as RouteIcon, Clock, ClipboardList, AlertTriangle, BarChart3, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

const items = [
  { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
  { title: "Étudiants", url: "/dashboard/etudiants", icon: GraduationCap },
  { title: "Bus", url: "/dashboard/bus", icon: Bus },
  { title: "Stations", url: "/dashboard/stations", icon: MapPin },
  { title: "Lignes", url: "/dashboard/lignes", icon: RouteIcon },
  { title: "Horaires", url: "/dashboard/horaires", icon: Clock },
  { title: "Affectations", url: "/dashboard/affectations", icon: ClipboardList },
  { title: "Trajets", url: "/dashboard/trajets", icon: BarChart3 },
  { title: "Incidents", url: "/dashboard/incidents", icon: AlertTriangle },
];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { signOut, user, isAdmin } = useAuth();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--gradient-hero)" }}>
            <Bus className="size-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sidebar-foreground">TransportU</span>
            <span className="text-xs text-sidebar-foreground/60">USTHB</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={path === item.url}>
                    <Link to={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <div className="text-xs text-sidebar-foreground/60 truncate group-data-[collapsible=icon]:hidden">
          {user?.email} {isAdmin && "· admin"}
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="justify-start text-sidebar-foreground hover:bg-sidebar-accent">
          <LogOut className="size-4" /> <span className="group-data-[collapsible=icon]:hidden">Déconnexion</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
