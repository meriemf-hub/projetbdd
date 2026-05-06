export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      abonnements: {
        Row: {
          actif: boolean
          created_at: string
          date_debut: string
          date_fin: string | null
          etudiant_id: string
          id: string
          ligne_id: string
        }
        Insert: {
          actif?: boolean
          created_at?: string
          date_debut?: string
          date_fin?: string | null
          etudiant_id: string
          id?: string
          ligne_id: string
        }
        Update: {
          actif?: boolean
          created_at?: string
          date_debut?: string
          date_fin?: string | null
          etudiant_id?: string
          id?: string
          ligne_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "abonnements_etudiant_id_fkey"
            columns: ["etudiant_id"]
            isOneToOne: false
            referencedRelation: "etudiants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abonnements_ligne_id_fkey"
            columns: ["ligne_id"]
            isOneToOne: false
            referencedRelation: "lignes"
            referencedColumns: ["id"]
          },
        ]
      }
      affectations_bus: {
        Row: {
          bus_id: string
          created_at: string
          date_debut: string
          date_fin: string | null
          id: string
          ligne_id: string
        }
        Insert: {
          bus_id: string
          created_at?: string
          date_debut: string
          date_fin?: string | null
          id?: string
          ligne_id: string
        }
        Update: {
          bus_id?: string
          created_at?: string
          date_debut?: string
          date_fin?: string | null
          id?: string
          ligne_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affectations_bus_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "bus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affectations_bus_ligne_id_fkey"
            columns: ["ligne_id"]
            isOneToOne: false
            referencedRelation: "lignes"
            referencedColumns: ["id"]
          },
        ]
      }
      bus: {
        Row: {
          capacite: number
          created_at: string
          etat: string
          id: string
          immatriculation: string
          marque: string | null
        }
        Insert: {
          capacite: number
          created_at?: string
          etat?: string
          id?: string
          immatriculation: string
          marque?: string | null
        }
        Update: {
          capacite?: number
          created_at?: string
          etat?: string
          id?: string
          immatriculation?: string
          marque?: string | null
        }
        Relationships: []
      }
      etudiants: {
        Row: {
          created_at: string
          email: string | null
          faculte: string | null
          id: string
          matricule: string
          nom: string
          prenom: string
          telephone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          faculte?: string | null
          id?: string
          matricule: string
          nom: string
          prenom: string
          telephone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          faculte?: string | null
          id?: string
          matricule?: string
          nom?: string
          prenom?: string
          telephone?: string | null
        }
        Relationships: []
      }
      historique_affectations: {
        Row: {
          ancienne_ligne_id: string | null
          date_changement: string
          etudiant_id: string
          id: string
          motif: string | null
          nouvelle_ligne_id: string | null
        }
        Insert: {
          ancienne_ligne_id?: string | null
          date_changement?: string
          etudiant_id: string
          id?: string
          motif?: string | null
          nouvelle_ligne_id?: string | null
        }
        Update: {
          ancienne_ligne_id?: string | null
          date_changement?: string
          etudiant_id?: string
          id?: string
          motif?: string | null
          nouvelle_ligne_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historique_affectations_ancienne_ligne_id_fkey"
            columns: ["ancienne_ligne_id"]
            isOneToOne: false
            referencedRelation: "lignes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historique_affectations_etudiant_id_fkey"
            columns: ["etudiant_id"]
            isOneToOne: false
            referencedRelation: "etudiants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historique_affectations_nouvelle_ligne_id_fkey"
            columns: ["nouvelle_ligne_id"]
            isOneToOne: false
            referencedRelation: "lignes"
            referencedColumns: ["id"]
          },
        ]
      }
      horaires: {
        Row: {
          created_at: string
          heure_arrivee: string | null
          heure_depart: string
          id: string
          jour: string
          ligne_id: string
        }
        Insert: {
          created_at?: string
          heure_arrivee?: string | null
          heure_depart: string
          id?: string
          jour: string
          ligne_id: string
        }
        Update: {
          created_at?: string
          heure_arrivee?: string | null
          heure_depart?: string
          id?: string
          jour?: string
          ligne_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "horaires_ligne_id_fkey"
            columns: ["ligne_id"]
            isOneToOne: false
            referencedRelation: "lignes"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          bus_id: string | null
          date_incident: string
          description: string | null
          id: string
          resolu: boolean
          trajet_id: string | null
          type_incident: string
        }
        Insert: {
          bus_id?: string | null
          date_incident?: string
          description?: string | null
          id?: string
          resolu?: boolean
          trajet_id?: string | null
          type_incident: string
        }
        Update: {
          bus_id?: string | null
          date_incident?: string
          description?: string | null
          id?: string
          resolu?: boolean
          trajet_id?: string | null
          type_incident?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "bus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_trajet_id_fkey"
            columns: ["trajet_id"]
            isOneToOne: false
            referencedRelation: "trajets"
            referencedColumns: ["id"]
          },
        ]
      }
      ligne_stations: {
        Row: {
          id: string
          ligne_id: string
          ordre: number
          station_id: string
        }
        Insert: {
          id?: string
          ligne_id: string
          ordre: number
          station_id: string
        }
        Update: {
          id?: string
          ligne_id?: string
          ordre?: number
          station_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ligne_stations_ligne_id_fkey"
            columns: ["ligne_id"]
            isOneToOne: false
            referencedRelation: "lignes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ligne_stations_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      lignes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          nom: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          nom: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          nom?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      stations: {
        Row: {
          adresse: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          nom: string
        }
        Insert: {
          adresse?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom: string
        }
        Update: {
          adresse?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom?: string
        }
        Relationships: []
      }
      trajets: {
        Row: {
          bus_id: string
          created_at: string
          date_trajet: string
          heure_arrivee_reelle: string | null
          heure_depart_reelle: string | null
          horaire_id: string | null
          id: string
          ligne_id: string
          retard_minutes: number
        }
        Insert: {
          bus_id: string
          created_at?: string
          date_trajet: string
          heure_arrivee_reelle?: string | null
          heure_depart_reelle?: string | null
          horaire_id?: string | null
          id?: string
          ligne_id: string
          retard_minutes?: number
        }
        Update: {
          bus_id?: string
          created_at?: string
          date_trajet?: string
          heure_arrivee_reelle?: string | null
          heure_depart_reelle?: string | null
          horaire_id?: string | null
          id?: string
          ligne_id?: string
          retard_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "trajets_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "bus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trajets_horaire_id_fkey"
            columns: ["horaire_id"]
            isOneToOne: false
            referencedRelation: "horaires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trajets_ligne_id_fkey"
            columns: ["ligne_id"]
            isOneToOne: false
            referencedRelation: "lignes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
