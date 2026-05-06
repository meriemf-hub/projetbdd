import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/CrudPage";
import { useLignesOptions } from "@/hooks/useOptions";

export const Route = createFileRoute("/dashboard/horaires")({ component: HorairesPage });

function HorairesPage() {
  const lignes = useLignesOptions();
  const ligneMap = new Map(lignes.data?.map((o) => [o.value, o.label]));
  return (
    <CrudPage
      table="horaires"
      title="Horaires"
      description="Planification des horaires par ligne et par jour."
      fields={[
        { name: "ligne_id", label: "Ligne", type: "select", required: true, options: lignes.data ?? [] },
        { name: "jour", label: "Jour", type: "select", required: true, options: ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"].map((j) => ({ value: j, label: j })) },
        { name: "heure_depart", label: "Heure départ", type: "time", required: true },
        { name: "heure_arrivee", label: "Heure arrivée", type: "time" },
      ]}
      columns={[
        { key: "ligne_id", label: "Ligne", render: (r) => ligneMap.get(r.ligne_id) ?? "—" },
        { key: "jour", label: "Jour" },
        { key: "heure_depart", label: "Départ" },
        { key: "heure_arrivee", label: "Arrivée" },
      ]}
    />
  );
}
