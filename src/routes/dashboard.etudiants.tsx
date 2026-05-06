import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/CrudPage";

export const Route = createFileRoute("/dashboard/etudiants")({ component: () => (
  <CrudPage
    table="etudiants"
    title="Étudiants"
    description="Gestion des étudiants et de leurs informations."
    fields={[
      { name: "matricule", label: "Matricule", required: true },
      { name: "nom", label: "Nom", required: true },
      { name: "prenom", label: "Prénom", required: true },
      { name: "email", label: "Email", type: "text" },
      { name: "telephone", label: "Téléphone" },
      { name: "faculte", label: "Faculté" },
    ]}
    columns={[
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "faculte", label: "Faculté" },
      { key: "email", label: "Email" },
    ]}
  />
)});
