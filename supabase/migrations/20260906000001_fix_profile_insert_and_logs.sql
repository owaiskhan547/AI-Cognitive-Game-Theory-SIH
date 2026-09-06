-- Allow authenticated users to create their own profile and caregiver records.
-- Also add missing operational tables used by the patient app.

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Caregivers can insert own record" ON public.caregivers;
CREATE POLICY "Caregivers can insert own record"
ON public.caregivers FOR INSERT
TO authenticated
WITH CHECK (profile_id = auth.uid());

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

ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_events ENABLE ROW LEVEL SECURITY;

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
