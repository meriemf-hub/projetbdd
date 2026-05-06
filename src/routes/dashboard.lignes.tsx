import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/CrudPage";

export const Route = createFileRoute("/dashboard/lignes")({ component: () => (
  <CrudPage
    table="lignes"
    title="Lignes"
    description="Lignes de transport universitaire."
    fields={[
      { name: "code", label: "Code", required: true },
      { name: "nom", label: "Nom", required: true },
      { name: "description", label: "Description" },
    ]}
    columns={[
      { key: "code", label: "Code" },
      { key: "nom", label: "Nom" },
      { key: "description", label: "Description" },
    ]}
  />
)});
