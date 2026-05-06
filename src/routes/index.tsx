import { createFileRoute, Link } from "@tanstack/react-router";
import { Bus, GraduationCap, Route as RouteIcon, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "TransportU — Gestion du transport universitaire" },
      { name: "description", content: "Gérez étudiants, bus, lignes, horaires et incidents du transport universitaire en un seul endroit." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
              <Bus className="size-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">TransportU</span>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost"><Link to="/auth">Connexion</Link></Button>
            <Button asChild><Link to="/dashboard">Tableau de bord</Link></Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <ShieldCheck className="size-3.5" /> USTHB · Faculté d'Informatique · 2025-2026
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
            La plateforme de gestion du transport universitaire
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Gérez les étudiants, bus, lignes et horaires. Suivez les affectations, les trajets et les incidents — tout en temps réel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="gap-2"><Link to="/dashboard">Accéder au tableau de bord <ArrowRight className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/auth">Créer un compte</Link></Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 grid gap-6 md:grid-cols-4">
        {[
          { icon: GraduationCap, title: "Étudiants", desc: "Abonnements, historique des changements de ligne." },
          { icon: Bus, title: "Bus", desc: "Capacités, état, affectations historisées." },
          { icon: RouteIcon, title: "Lignes & stations", desc: "Itinéraires, plusieurs stations par ligne." },
          { icon: Clock, title: "Horaires & trajets", desc: "Planification, retards et incidents." },
        ].map((f) => (
          <div key={f.title} className="p-6 rounded-xl bg-card border" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <div className="size-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
              <f.icon className="size-5 text-primary" />
            </div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-6 py-6 text-sm text-muted-foreground text-center">
          © 2026 TransportU · Projet BDD · USTHB
        </div>
      </footer>
    </div>
  );
}
