-- SmritiCare: run this once in the Supabase SQL Editor (Dashboard → SQL → New query → Run).
-- Safe to re-run. Fixes: "Could not find the table 'public.profiles' in the schema cache"

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('patient', 'caregiver');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'patient',
  full_name TEXT NOT NULL,
  phone TEXT,
  dob DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  emergency_contact TEXT,
  blood_group TEXT,
  medical_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.caregivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.caregiver_patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID NOT NULL REFERENCES public.caregivers(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL DEFAULT 'Caregiver',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_caregiver_patient UNIQUE (caregiver_id, patient_id)
);

CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  instructions TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'routine',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  game_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0,
  played_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.assistant_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.assistant_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.assistant_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT
);

CREATE TABLE IF NOT EXISTS public.medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT,
  taken_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE UNIQUE INDEX IF NOT EXISTS medication_logs_medication_scheduled_idx
  ON public.medication_logs (medication_id, scheduled_for);

CREATE TABLE IF NOT EXISTS public.schedule_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  status TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_schedule_patient UNIQUE (schedule_id, patient_id)
);

CREATE TABLE IF NOT EXISTS public.emergency_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL CHECK (game_type IN ('memory_match', 'sequence_recall', 'pattern_recall', 'word_recall')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  score INTEGER NOT NULL CHECK (score >= 0),
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds >= 0),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_patients_profile ON public.patients(profile_id);
CREATE INDEX IF NOT EXISTS idx_caregivers_profile ON public.caregivers(profile_id);
CREATE INDEX IF NOT EXISTS idx_caregiver_patients_c ON public.caregiver_patients(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_caregiver_patients_p ON public.caregiver_patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_patient ON public.medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_schedules_patient ON public.schedules(patient_id);
CREATE INDEX IF NOT EXISTS idx_memories_patient ON public.memories(patient_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_patient ON public.game_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_assistant_conv_patient ON public.assistant_conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_assistant_msg_conv ON public.assistant_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_patient ON public.emergency_contacts(patient_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_patient ON public.game_scores(patient_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_completed_at ON public.game_scores(completed_at DESC);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role := 'patient';
  v_full_name TEXT;
  v_phone TEXT;
  v_dob DATE;
  v_avatar_url TEXT;
BEGIN
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    BEGIN
      v_role := (NEW.raw_user_meta_data->>'role')::user_role;
    EXCEPTION WHEN OTHERS THEN
      v_role := 'patient'::user_role;
    END;
  END IF;

  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'User'
  );
  v_phone := NEW.raw_user_meta_data->>'phone';
  IF NEW.raw_user_meta_data->>'dob' IS NOT NULL THEN
    BEGIN
      v_dob := (NEW.raw_user_meta_data->>'dob')::date;
    EXCEPTION WHEN OTHERS THEN
      v_dob := NULL;
    END;
  END IF;
  v_avatar_url := COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture');

  INSERT INTO public.profiles (id, role, full_name, phone, dob, avatar_url)
  VALUES (NEW.id, v_role, v_full_name, v_phone, v_dob, v_avatar_url)
  ON CONFLICT (id) DO NOTHING;

  IF v_role = 'patient' THEN
    INSERT INTO public.patients (profile_id, emergency_contact)
    VALUES (NEW.id, v_phone)
    ON CONFLICT (profile_id) DO NOTHING;
  ELSIF v_role = 'caregiver' THEN
    INSERT INTO public.caregivers (profile_id)
    VALUES (NEW.id)
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Backfill accounts that were created before this schema existed
INSERT INTO public.profiles (id, role, full_name, phone, dob, avatar_url)
SELECT
  u.id,
  CASE
    WHEN COALESCE(u.raw_user_meta_data->>'role', '') = 'caregiver' THEN 'caregiver'::user_role
    ELSE 'patient'::user_role
  END,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1),
    'User'
  ),
  u.raw_user_meta_data->>'phone',
  CASE
    WHEN COALESCE(u.raw_user_meta_data->>'dob', '') ~ '^\d{4}-\d{2}-\d{2}'
      THEN (u.raw_user_meta_data->>'dob')::date
    ELSE NULL
  END,
  COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture')
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.patients (profile_id)
SELECT p.id FROM public.profiles p
WHERE p.role = 'patient'
ON CONFLICT (profile_id) DO NOTHING;

INSERT INTO public.caregivers (profile_id)
SELECT p.id FROM public.profiles p
WHERE p.role = 'caregiver'
ON CONFLICT (profile_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.get_patient_id_for_user(p_user_id UUID)
RETURNS UUID AS $$
  SELECT id FROM public.patients WHERE profile_id = p_user_id LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_caregiver_id_for_user(p_user_id UUID)
RETURNS UUID AS $$
  SELECT id FROM public.caregivers WHERE profile_id = p_user_id LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.can_access_patient(p_patient_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF p_user_id IS NULL OR p_patient_id IS NULL THEN
    RETURN false;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.patients
    WHERE id = p_patient_id AND profile_id = p_user_id
  ) THEN
    RETURN true;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.caregiver_patients cp
    JOIN public.caregivers c ON c.id = cp.caregiver_id
    WHERE cp.patient_id = p_patient_id AND c.profile_id = p_user_id
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile or assigned patient profiles" ON public.profiles;
CREATE POLICY "Users can view own profile or assigned patient profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.profile_id = public.profiles.id
    AND public.can_access_patient(p.id, auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.caregivers c
    JOIN public.caregiver_patients cp ON cp.caregiver_id = c.id
    JOIN public.patients p ON p.id = cp.patient_id
    WHERE c.profile_id = public.profiles.id
    AND p.profile_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Patients and assigned caregivers can view patient record" ON public.patients;
CREATE POLICY "Patients and assigned caregivers can view patient record"
ON public.patients FOR SELECT
TO authenticated
USING (public.can_access_patient(id, auth.uid()));

DROP POLICY IF EXISTS "Patients and caregivers can update patient record" ON public.patients;
CREATE POLICY "Patients and caregivers can update patient record"
ON public.patients FOR UPDATE
TO authenticated
USING (public.can_access_patient(id, auth.uid()))
WITH CHECK (public.can_access_patient(id, auth.uid()));

DROP POLICY IF EXISTS "Caregivers can create patient records" ON public.patients;
CREATE POLICY "Caregivers can create patient records"
ON public.patients FOR INSERT
TO authenticated
WITH CHECK (
  profile_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.caregivers WHERE profile_id = auth.uid())
);

DROP POLICY IF EXISTS "Caregivers can view own record or assigned patients can view" ON public.caregivers;
CREATE POLICY "Caregivers can view own record or assigned patients can view"
ON public.caregivers FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.caregiver_patients cp
    JOIN public.patients p ON p.id = cp.patient_id
    WHERE cp.caregiver_id = public.caregivers.id
    AND p.profile_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Caregivers can update own record" ON public.caregivers;
CREATE POLICY "Caregivers can update own record"
ON public.caregivers FOR UPDATE
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Caregivers can insert own record" ON public.caregivers;
CREATE POLICY "Caregivers can insert own record"
ON public.caregivers FOR INSERT
TO authenticated
WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "View caregiver-patient links" ON public.caregiver_patients;
CREATE POLICY "View caregiver-patient links"
ON public.caregiver_patients FOR SELECT
TO authenticated
USING (
  caregiver_id = public.get_caregiver_id_for_user(auth.uid())
  OR patient_id = public.get_patient_id_for_user(auth.uid())
);

DROP POLICY IF EXISTS "Caregivers can manage caregiver-patient links" ON public.caregiver_patients;
CREATE POLICY "Caregivers can manage caregiver-patient links"
ON public.caregiver_patients FOR INSERT
TO authenticated
WITH CHECK (caregiver_id = public.get_caregiver_id_for_user(auth.uid()));

DROP POLICY IF EXISTS "Caregivers can delete caregiver-patient links" ON public.caregiver_patients;
CREATE POLICY "Caregivers can delete caregiver-patient links"
ON public.caregiver_patients FOR DELETE
TO authenticated
USING (caregiver_id = public.get_caregiver_id_for_user(auth.uid()));

DROP POLICY IF EXISTS "Access medications" ON public.medications;
CREATE POLICY "Access medications"
ON public.medications FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

DROP POLICY IF EXISTS "Access schedules" ON public.schedules;
CREATE POLICY "Access schedules"
ON public.schedules FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

DROP POLICY IF EXISTS "Access memories" ON public.memories;
CREATE POLICY "Access memories"
ON public.memories FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

DROP POLICY IF EXISTS "Access game_sessions" ON public.game_sessions;
CREATE POLICY "Access game_sessions"
ON public.game_sessions FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

DROP POLICY IF EXISTS "Access assistant_conversations" ON public.assistant_conversations;
CREATE POLICY "Access assistant_conversations"
ON public.assistant_conversations FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

DROP POLICY IF EXISTS "Access assistant_messages" ON public.assistant_messages;
CREATE POLICY "Access assistant_messages"
ON public.assistant_messages FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.assistant_conversations ac
    WHERE ac.id = assistant_messages.conversation_id
    AND public.can_access_patient(ac.patient_id, auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.assistant_conversations ac
    WHERE ac.id = assistant_messages.conversation_id
    AND public.can_access_patient(ac.patient_id, auth.uid())
  )
);

DROP POLICY IF EXISTS "Access emergency_contacts" ON public.emergency_contacts;
CREATE POLICY "Access emergency_contacts"
ON public.emergency_contacts FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

DROP POLICY IF EXISTS "Access medication_logs" ON public.medication_logs;
CREATE POLICY "Access medication_logs"
ON public.medication_logs FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

DROP POLICY IF EXISTS "Access schedule_completions" ON public.schedule_completions;
CREATE POLICY "Access schedule_completions"
ON public.schedule_completions FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

DROP POLICY IF EXISTS "Access emergency_events" ON public.emergency_events;
CREATE POLICY "Access emergency_events"
ON public.emergency_events FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

DROP POLICY IF EXISTS "Access game scores" ON public.game_scores;
CREATE POLICY "Access game scores"
ON public.game_scores FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('memories', 'memories', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

NOTIFY pgrst, 'reload schema';
