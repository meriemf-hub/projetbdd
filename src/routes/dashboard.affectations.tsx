import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/CrudPage";
import { useBusOptions, useLignesOptions } from "@/hooks/useOptions";

export const Route = createFileRoute("/dashboard/affectations")({ component: Page });

function Page() {
  const bus = useBusOptions();
  const lignes = useLignesOptions();
  const busMap = new Map(bus.data?.map((o) => [o.value, o.label]));
  const ligneMap = new Map(lignes.data?.map((o) => [o.value, o.label]));
  return (
    <CrudPage
      table="affectations_bus"
      title="Affectations de bus"
      description="Historique d'affectation des bus aux lignes."
      fields={[
        { name: "bus_id", label: "Bus", type: "select", required: true, options: bus.data ?? [] },
        { name: "ligne_id", label: "Ligne", type: "select", required: true, options: lignes.data ?? [] },
        { name: "date_debut", label: "Date début", type: "date", required: true },
        { name: "date_fin", label: "Date fin", type: "date" },
      ]}
      columns={[
        { key: "bus_id", label: "Bus", render: (r) => busMap.get(r.bus_id) ?? "—" },
        { key: "ligne_id", label: "Ligne", render: (r) => ligneMap.get(r.ligne_id) ?? "—" },
        { key: "date_debut", label: "Début" },
        { key: "date_fin", label: "Fin", render: (r) => r.date_fin ?? "En cours" },
      ]}
    />
  );
}
