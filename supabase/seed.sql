-- supabase/seed.sql
-- Smriti Seed Data: Initial Development Fixtures
-- Contains: 1 Caregiver, 2 Patients, Sample Medications, Schedules, Memories

-- 1. Create Auth Users
-- Default password for all seed accounts: "Smriti2026!"
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES
-- Caregiver: Priya Kumar
(
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'caregiver@smriti.local',
    extensions.crypt('Smriti2026!', extensions.gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Priya Kumar", "role": "caregiver", "phone": "+91-98765-43210"}',
    now(),
    now()
),
-- Patient 1: Rajesh Kumar
(
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'patient@smriti.local',
    extensions.crypt('Smriti2026!', extensions.gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rajesh Kumar", "role": "patient", "phone": "+91-98765-00001", "dob": "1952-04-15"}',
    now(),
    now()
),
-- Patient 2: Savitri Devi
(
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'patient2@smriti.local',
    extensions.crypt('Smriti2026!', extensions.gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Savitri Devi", "role": "patient", "phone": "+91-98765-00002", "dob": "1955-08-20"}',
    now(),
    now()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Upsert Profiles
INSERT INTO public.profiles (id, role, full_name, phone, dob, avatar_url)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'caregiver', 'Priya Kumar', '+91-98765-43210', '1985-06-12', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
    ('00000000-0000-0000-0000-000000000002', 'patient', 'Rajesh Kumar', '+91-98765-00001', '1952-04-15', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'),
    ('00000000-0000-0000-0000-000000000003', 'patient', 'Savitri Devi', '+91-98765-00002', '1955-08-20', 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150')
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    dob = EXCLUDED.dob;

-- 3. Caregiver Record
INSERT INTO public.caregivers (id, profile_id, organization)
VALUES
    ('11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Smriti Family Care')
ON CONFLICT (id) DO NOTHING;

-- 4. Patients Records
INSERT INTO public.patients (id, profile_id, emergency_contact, blood_group, medical_notes)
VALUES
    (
        '22222222-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        '+91-98765-43210',
        'B+',
        'Mild Cognitive Impairment. Active daily routine.'
    ),
    (
        '22222222-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000003',
        '+91-98765-43210',
        'O+',
        'Early-stage Alzheimer. Enjoys morning walks and classical music.'
    )
ON CONFLICT (id) DO NOTHING;

-- 5. Caregiver-Patient Links
INSERT INTO public.caregiver_patients (id, caregiver_id, patient_id, relationship)
VALUES
    ('33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Daughter'),
    ('33333333-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'Care Manager')
ON CONFLICT (id) DO NOTHING;

-- 6. Sample Medications
INSERT INTO public.medications (id, patient_id, name, dosage, frequency, instructions, is_active)
VALUES
    ('44444444-0001-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Donepezil', '10mg', 'Once daily', 'Take with water after breakfast', true),
    ('44444444-0002-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Memantine', '5mg', 'Twice daily', 'Morning and evening with meals', true),
    ('44444444-0003-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Vitamin E', '400 IU', 'Once daily', 'After lunch', true),
    ('44444444-0004-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Rivastigmine', '3mg', 'Twice daily', 'With morning and evening meals', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Sample Schedules
INSERT INTO public.schedules (id, patient_id, title, description, date, time, type)
VALUES
    ('55555555-0001-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Morning Medication', 'Donepezil 10mg', CURRENT_DATE, '08:00', 'medication'),
    ('55555555-0002-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Memory Game Session', 'Play memory match game', CURRENT_DATE, '09:30', 'game'),
    ('55555555-0003-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Doctor Video Checkup', 'Review session with Dr. Sharma', CURRENT_DATE, '11:00', 'appointment'),
    ('55555555-0004-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Afternoon Medication', 'Vitamin E 400 IU', CURRENT_DATE, '13:00', 'medication'),
    ('55555555-0005-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Photo Album Review', 'Look at family pictures', CURRENT_DATE, '15:00', 'memory'),
    ('55555555-0006-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Evening Medication', 'Memantine 5mg', CURRENT_DATE, '20:00', 'medication')
ON CONFLICT (id) DO NOTHING;

-- 8. Sample Memories
INSERT INTO public.memories (id, patient_id, title, description, media_url)
VALUES
    ('66666666-0001-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Family Picnic at Lodhi Garden', 'A lovely afternoon with Priya and grandson Rohan.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400'),
    ('66666666-0002-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Grandson Rohan''s Birthday', 'Rohan turned 5 years old. Beautiful celebration.', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400'),
    ('66666666-0003-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Morning Walk at India Gate', 'Clear sunny morning walk with daughter Priya.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400')
ON CONFLICT (id) DO NOTHING;

-- 9. Sample Emergency Contacts
INSERT INTO public.emergency_contacts (id, patient_id, name, phone, relationship)
VALUES
    ('77777777-0001-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Priya Kumar', '+91-98765-43210', 'Daughter'),
    ('77777777-0002-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Emergency Ambulance', '102', 'Emergency Services')
ON CONFLICT (id) DO NOTHING;
