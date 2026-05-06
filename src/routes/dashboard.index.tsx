import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Bus, Route as RouteIcon, AlertTriangle, Clock, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({ component: DashboardHome });

function StatCard({ icon: Icon, label, value, accent }: any) {
  return (
    <div className="bg-card border rounded-xl p-5" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="size-5 text-accent" />
      </div>
      <div className="mt-2 text-3xl font-bold" style={accent ? { color: "var(--accent)" } : undefined}>{value ?? "—"}</div>
    </div>
  );
}

function DashboardHome() {
  const counts = useQuery({
    queryKey: ["dashboard-counts"],
    queryFn: async () => {
      const tables = ["etudiants", "bus", "lignes", "stations", "incidents", "trajets"] as const;
      const out: Record<string, number> = {};
      await Promise.all(tables.map(async (t) => {
        const { count } = await (supabase as any).from(t).select("*", { count: "exact", head: true });
        out[t] = count ?? 0;
      }));
      return out;
    },
  });

  const lignesCharge = useQuery({
    queryKey: ["lignes-charge"],
    queryFn: async () => {
      const { data: lignes } = await supabase.from("lignes").select("id, code, nom");
      const { data: abos } = await supabase.from("abonnements").select("ligne_id").eq("actif", true);
      const map = new Map<string, number>();
      abos?.forEach((a) => map.set(a.ligne_id, (map.get(a.ligne_id) ?? 0) + 1));
      return lignes?.map((l) => ({ ...l, n: map.get(l.id) ?? 0 })).sort((a, b) => b.n - a.n).slice(0, 5) ?? [];
    },
  });

  const retards = useQuery({
    queryKey: ["trajets-retard"],
    queryFn: async () => {
      const { data } = await supabase.from("trajets").select("id, date_trajet, retard_minutes, lignes(code, nom)").gt("retard_minutes", 0).order("date_trajet", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vue d'ensemble</h2>
        <p className="text-sm text-muted-foreground">Indicateurs clés de la plateforme.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={GraduationCap} label="Étudiants" value={counts.data?.etudiants} />
        <StatCard icon={Bus} label="Bus" value={counts.data?.bus} />
        <StatCard icon={RouteIcon} label="Lignes" value={counts.data?.lignes} />
        <StatCard icon={Clock} label="Stations" value={counts.data?.stations} />
        <StatCard icon={TrendingUp} label="Trajets" value={counts.data?.trajets} />
        <StatCard icon={AlertTriangle} label="Incidents" value={counts.data?.incidents} accent />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-semibold mb-3">Lignes les plus chargées</h3>
          <div className="space-y-2">
            {lignesCharge.data?.length ? lignesCharge.data.map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm">
                <span><span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded mr-2">{l.code}</span>{l.nom}</span>
                <span className="font-semibold">{l.n} étudiants</span>
              </div>
            )) : <p className="text-sm text-muted-foreground">Aucune donnée.</p>}
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-semibold mb-3">Derniers trajets en retard</h3>
          <div className="space-y-2">
            {retards.data?.length ? retards.data.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span>{t.date_trajet} · {t.lignes?.code ?? "—"}</span>
                <span className="font-semibold text-destructive">+{t.retard_minutes} min</span>
              </div>
            )) : <p className="text-sm text-muted-foreground">Aucun retard enregistré.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
