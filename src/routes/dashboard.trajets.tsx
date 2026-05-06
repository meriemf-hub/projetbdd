import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/CrudPage";
import { useBusOptions, useLignesOptions } from "@/hooks/useOptions";

export const Route = createFileRoute("/dashboard/trajets")({ component: Page });

function Page() {
  const bus = useBusOptions();
  const lignes = useLignesOptions();
  const busMap = new Map(bus.data?.map((o) => [o.value, o.label]));
  const ligneMap = new Map(lignes.data?.map((o) => [o.value, o.label]));
  return (
    <CrudPage
      table="trajets"
      title="Trajets"
      description="Passages effectifs des bus avec retards éventuels."
      fields={[
        { name: "bus_id", label: "Bus", type: "select", required: true, options: bus.data ?? [] },
        { name: "ligne_id", label: "Ligne", type: "select", required: true, options: lignes.data ?? [] },
        { name: "date_trajet", label: "Date", type: "date", required: true },
        { name: "heure_depart_reelle", label: "Départ réel", type: "time" },
        { name: "heure_arrivee_reelle", label: "Arrivée réelle", type: "time" },
        { name: "retard_minutes", label: "Retard (min)", type: "number" },
      ]}
      columns={[
        { key: "date_trajet", label: "Date" },
        { key: "bus_id", label: "Bus", render: (r) => busMap.get(r.bus_id) ?? "—" },
        { key: "ligne_id", label: "Ligne", render: (r) => ligneMap.get(r.ligne_id) ?? "—" },
        { key: "heure_depart_reelle", label: "Départ" },
        { key: "retard_minutes", label: "Retard", render: (r) => r.retard_minutes > 0 ? <span className="text-destructive font-semibold">+{r.retard_minutes} min</span> : "À l'heure" },
      ]}
    />
  );
}
