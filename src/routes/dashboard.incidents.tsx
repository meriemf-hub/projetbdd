import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/CrudPage";
import { useBusOptions } from "@/hooks/useOptions";

export const Route = createFileRoute("/dashboard/incidents")({ component: Page });

function Page() {
  const bus = useBusOptions();
  const busMap = new Map(bus.data?.map((o) => [o.value, o.label]));
  return (
    <CrudPage
      table="incidents"
      title="Incidents"
      description="Suivi des incidents et retards."
      fields={[
        { name: "bus_id", label: "Bus", type: "select", options: bus.data ?? [] },
        { name: "type_incident", label: "Type", type: "select", required: true, options: [
          { value: "retard", label: "Retard" }, { value: "panne", label: "Panne" }, { value: "accident", label: "Accident" }, { value: "autre", label: "Autre" },
        ]},
        { name: "description", label: "Description" },
      ]}
      columns={[
        { key: "date_incident", label: "Date", render: (r) => new Date(r.date_incident).toLocaleString("fr-FR") },
        { key: "type_incident", label: "Type" },
        { key: "bus_id", label: "Bus", render: (r) => r.bus_id ? busMap.get(r.bus_id) ?? "—" : "—" },
        { key: "description", label: "Description" },
        { key: "resolu", label: "Statut", render: (r) => r.resolu ? "Résolu" : "Ouvert" },
      ]}
    />
  );
}
