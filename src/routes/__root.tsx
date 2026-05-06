import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TransportU — Gestion du transport universitaire USTHB" },
      { name: "description", content: "Plateforme de gestion du transport universitaire : étudiants, bus, lignes, horaires, affectations et incidents." },
      { property: "og:title", content: "TransportU — Gestion du transport universitaire USTHB" },
      { name: "twitter:title", content: "TransportU — Gestion du transport universitaire USTHB" },
      { property: "og:description", content: "Plateforme de gestion du transport universitaire : étudiants, bus, lignes, horaires, affectations et incidents." },
      { name: "twitter:description", content: "Plateforme de gestion du transport universitaire : étudiants, bus, lignes, horaires, affectations et incidents." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/527127f1-df40-429d-a2c3-7aac96b284e3/id-preview-c1a1db60--a5a93946-a391-4a76-8e70-6a20476b07fd.lovable.app-1778107031597.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/527127f1-df40-429d-a2c3-7aac96b284e3/id-preview-c1a1db60--a5a93946-a391-4a76-8e70-6a20476b07fd.lovable.app-1778107031597.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center"><h1 className="text-6xl font-bold">404</h1><p className="text-muted-foreground mt-2">Page introuvable</p></div>
    </div>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
