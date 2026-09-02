-- 20260902000001_initial_schema.sql
-- Smriti: Initial Database Schema (PostgreSQL + Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('patient', 'caregiver');

-- 2. Generic Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Profiles Table (1:1 with auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'caregiver',
    full_name TEXT NOT NULL,
    phone TEXT,
    dob DATE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. Patients Table
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    emergency_contact TEXT,
    blood_group TEXT,
    medical_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Caregivers Table
CREATE TABLE public.caregivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Caregiver-Patient Assignment Table
CREATE TABLE public.caregiver_patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caregiver_id UUID NOT NULL REFERENCES public.caregivers(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL DEFAULT 'Caregiver',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_caregiver_patient UNIQUE (caregiver_id, patient_id)
);

-- 7. Medications Table
CREATE TABLE public.medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    instructions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Schedules Table
CREATE TABLE public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'routine',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Memories Table
CREATE TABLE public.memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Game Sessions Table
CREATE TABLE public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    game_name TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    duration INTEGER NOT NULL DEFAULT 0,
    played_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Assistant Conversations Table
CREATE TABLE public.assistant_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Assistant Messages Table
CREATE TABLE public.assistant_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.assistant_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Emergency Contacts Table
CREATE TABLE public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    relationship TEXT
);

-- Performance Indexes
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_patients_profile ON public.patients(profile_id);
CREATE INDEX idx_caregivers_profile ON public.caregivers(profile_id);
CREATE INDEX idx_caregiver_patients_c ON public.caregiver_patients(caregiver_id);
CREATE INDEX idx_caregiver_patients_p ON public.caregiver_patients(patient_id);
CREATE INDEX idx_medications_patient ON public.medications(patient_id);
CREATE INDEX idx_schedules_patient ON public.schedules(patient_id);
CREATE INDEX idx_memories_patient ON public.memories(patient_id);
CREATE INDEX idx_game_sessions_patient ON public.game_sessions(patient_id);
CREATE INDEX idx_assistant_conv_patient ON public.assistant_conversations(patient_id);
CREATE INDEX idx_assistant_msg_conv ON public.assistant_messages(conversation_id);
CREATE INDEX idx_emergency_contacts_patient ON public.emergency_contacts(patient_id);

-- Auto-provision Profile and Role record on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role user_role := 'caregiver';
    v_full_name TEXT;
    v_phone TEXT;
    v_dob DATE;
    v_avatar_url TEXT;
BEGIN
    IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
        BEGIN
            v_role := (NEW.raw_user_meta_data->>'role')::user_role;
        EXCEPTION WHEN OTHERS THEN
            v_role := 'caregiver'::user_role;
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
    v_avatar_url := NEW.raw_user_meta_data->>'avatar_url';

    INSERT INTO public.profiles (
        id,
        role,
        full_name,
        phone,
        dob,
        avatar_url
    ) VALUES (
        NEW.id,
        v_role,
        v_full_name,
        v_phone,
        v_dob,
        v_avatar_url
    );

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
