-- 20260902000002_rls_policies.sql
-- Smriti: Strict Row Level Security (RLS) Policies
-- Ensures patients can only access their own data, and caregivers only access assigned patients.

-- 1. Helper Security Definer Functions
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

    -- Check if user is the patient directly
    IF EXISTS (
        SELECT 1 FROM public.patients
        WHERE id = p_patient_id AND profile_id = p_user_id
    ) THEN
        RETURN true;
    END IF;

    -- Check if user is an assigned caregiver
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

-- 2. Enable RLS on ALL Tables
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

-- 3. RLS: profiles
-- Users can view their own profile, or caregivers can view profiles of their assigned patients
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

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 4. RLS: patients
CREATE POLICY "Patients and assigned caregivers can view patient record"
ON public.patients FOR SELECT
TO authenticated
USING (public.can_access_patient(id, auth.uid()));

CREATE POLICY "Patients and caregivers can update patient record"
ON public.patients FOR UPDATE
TO authenticated
USING (public.can_access_patient(id, auth.uid()))
WITH CHECK (public.can_access_patient(id, auth.uid()));

CREATE POLICY "Caregivers can create patient records"
ON public.patients FOR INSERT
TO authenticated
WITH CHECK (
    profile_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.caregivers WHERE profile_id = auth.uid())
);

-- 5. RLS: caregivers
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

CREATE POLICY "Caregivers can update own record"
ON public.caregivers FOR UPDATE
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- 6. RLS: caregiver_patients
CREATE POLICY "View caregiver-patient links"
ON public.caregiver_patients FOR SELECT
TO authenticated
USING (
    caregiver_id = public.get_caregiver_id_for_user(auth.uid())
    OR patient_id = public.get_patient_id_for_user(auth.uid())
);

CREATE POLICY "Caregivers can manage caregiver-patient links"
ON public.caregiver_patients FOR INSERT
TO authenticated
WITH CHECK (caregiver_id = public.get_caregiver_id_for_user(auth.uid()));

CREATE POLICY "Caregivers can delete caregiver-patient links"
ON public.caregiver_patients FOR DELETE
TO authenticated
USING (caregiver_id = public.get_caregiver_id_for_user(auth.uid()));

-- 7. RLS: medications
CREATE POLICY "Access medications"
ON public.medications FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

-- 8. RLS: schedules
CREATE POLICY "Access schedules"
ON public.schedules FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

-- 9. RLS: memories
CREATE POLICY "Access memories"
ON public.memories FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

-- 10. RLS: game_sessions
CREATE POLICY "Access game_sessions"
ON public.game_sessions FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

-- 11. RLS: assistant_conversations
CREATE POLICY "Access assistant_conversations"
ON public.assistant_conversations FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));

-- 12. RLS: assistant_messages
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

-- 13. RLS: emergency_contacts
CREATE POLICY "Access emergency_contacts"
ON public.emergency_contacts FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));
