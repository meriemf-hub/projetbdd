import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/CrudPage";

export const Route = createFileRoute("/dashboard/bus")({ component: () => (
  <CrudPage
    table="bus"
    title="Bus"
    description="Parc des bus avec leur capacité et état."
    fields={[
      { name: "immatriculation", label: "Immatriculation", required: true },
      { name: "marque", label: "Marque" },
      { name: "capacite", label: "Capacité", type: "number", required: true },
      { name: "etat", label: "État", type: "select", options: [
        { value: "actif", label: "Actif" }, { value: "maintenance", label: "Maintenance" }, { value: "hors_service", label: "Hors service" },
      ]},
    ]}
    columns={[
      { key: "immatriculation", label: "Immatriculation" },
      { key: "marque", label: "Marque" },
      { key: "capacite", label: "Capacité" },
      { key: "etat", label: "État" },
    ]}
  />
)});
