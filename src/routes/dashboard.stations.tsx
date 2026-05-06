import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/CrudPage";

export const Route = createFileRoute("/dashboard/stations")({ component: () => (
  <CrudPage
    table="stations"
    title="Stations"
    description="Stations desservies par les lignes."
    fields={[
      { name: "nom", label: "Nom", required: true },
      { name: "adresse", label: "Adresse" },
      { name: "latitude", label: "Latitude", type: "number" },
      { name: "longitude", label: "Longitude", type: "number" },
    ]}
    columns={[
      { key: "nom", label: "Nom" },
      { key: "adresse", label: "Adresse" },
    ]}
  />
)});
