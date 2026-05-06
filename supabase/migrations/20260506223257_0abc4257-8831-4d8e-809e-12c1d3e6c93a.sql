-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Domain tables
CREATE TABLE public.etudiants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricule TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  faculte TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.bus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  immatriculation TEXT UNIQUE NOT NULL,
  marque TEXT,
  capacite INTEGER NOT NULL CHECK (capacite > 0),
  etat TEXT NOT NULL DEFAULT 'actif',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  adresse TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.lignes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.ligne_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ligne_id UUID NOT NULL REFERENCES public.lignes(id) ON DELETE CASCADE,
  station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  ordre INTEGER NOT NULL,
  UNIQUE(ligne_id, station_id),
  UNIQUE(ligne_id, ordre)
);

CREATE TABLE public.horaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ligne_id UUID NOT NULL REFERENCES public.lignes(id) ON DELETE CASCADE,
  jour TEXT NOT NULL,
  heure_depart TIME NOT NULL,
  heure_arrivee TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.affectations_bus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id UUID NOT NULL REFERENCES public.bus(id) ON DELETE CASCADE,
  ligne_id UUID NOT NULL REFERENCES public.lignes(id) ON DELETE CASCADE,
  date_debut DATE NOT NULL,
  date_fin DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.abonnements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etudiant_id UUID NOT NULL REFERENCES public.etudiants(id) ON DELETE CASCADE,
  ligne_id UUID NOT NULL REFERENCES public.lignes(id) ON DELETE CASCADE,
  date_debut DATE NOT NULL DEFAULT CURRENT_DATE,
  date_fin DATE,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX one_active_subscription_per_student
  ON public.abonnements(etudiant_id) WHERE actif = true;

CREATE TABLE public.historique_affectations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etudiant_id UUID NOT NULL REFERENCES public.etudiants(id) ON DELETE CASCADE,
  ancienne_ligne_id UUID REFERENCES public.lignes(id),
  nouvelle_ligne_id UUID REFERENCES public.lignes(id),
  date_changement TIMESTAMPTZ NOT NULL DEFAULT now(),
  motif TEXT
);

CREATE TABLE public.trajets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id UUID NOT NULL REFERENCES public.bus(id) ON DELETE CASCADE,
  ligne_id UUID NOT NULL REFERENCES public.lignes(id) ON DELETE CASCADE,
  horaire_id UUID REFERENCES public.horaires(id) ON DELETE SET NULL,
  date_trajet DATE NOT NULL,
  heure_depart_reelle TIME,
  heure_arrivee_reelle TIME,
  retard_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trajet_id UUID REFERENCES public.trajets(id) ON DELETE SET NULL,
  bus_id UUID REFERENCES public.bus(id) ON DELETE SET NULL,
  type_incident TEXT NOT NULL,
  description TEXT,
  date_incident TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolu BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etudiants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lignes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ligne_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affectations_bus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abonnements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historique_affectations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trajets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- user_roles policies
CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles_admin_all" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Generic policies: authenticated read, admin write
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['etudiants','bus','stations','lignes','ligne_stations','horaires','affectations_bus','abonnements','historique_affectations','trajets','incidents'])
  LOOP
    EXECUTE format('CREATE POLICY "%s_read" ON public.%I FOR SELECT TO authenticated USING (true);', t, t);
    EXECUTE format('CREATE POLICY "%s_write" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''));', t, t);
  END LOOP;
END $$;

-- Auto profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER SET search_path = public AS $$
DECLARE
  is_first BOOLEAN;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles) INTO is_first;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN is_first THEN 'admin'::app_role ELSE 'user'::app_role END);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();