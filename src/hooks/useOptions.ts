import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLignesOptions() {
  return useQuery({
    queryKey: ["lignes-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lignes").select("id, code, nom").order("code");
      if (error) throw error;
      return data.map((l) => ({ value: l.id, label: `${l.code} — ${l.nom}` }));
    },
  });
}

export function useBusOptions() {
  return useQuery({
    queryKey: ["bus-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bus").select("id, immatriculation").order("immatriculation");
      if (error) throw error;
      return data.map((b) => ({ value: b.id, label: b.immatriculation }));
    },
  });
}

export function useStationsOptions() {
  return useQuery({
    queryKey: ["stations-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stations").select("id, nom").order("nom");
      if (error) throw error;
      return data.map((s) => ({ value: s.id, label: s.nom }));
    },
  });
}

export function useEtudiantsOptions() {
  return useQuery({
    queryKey: ["etudiants-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("etudiants").select("id, matricule, nom, prenom").order("matricule");
      if (error) throw error;
      return data.map((e) => ({ value: e.id, label: `${e.matricule} — ${e.prenom} ${e.nom}` }));
    },
  });
}
