import type { PatientContext } from './types'

export const mockPatientContext: PatientContext = {
	patientId: 'patient-rajesh-kumar-001',
	name: 'Rajesh Kumar',
	dateOfBirth: '1952-04-15',
	preferredLanguage: 'English',
	caregiverName: 'Priya Kumar',
	caregiverPhone: '+91-98765-43210',
	medicalNotes: 'Mild cognitive impairment with short-term memory loss. Benefits from a calm daily routine, familiar reminders, and gentle reorientation.',
	medications: [
		{
			id: 'med-donepezil-001',
			name: 'Donepezil',
			dosage: '10 mg',
			frequency: 'Once daily',
			instructions: 'Take with water after breakfast.',
			isActive: true,
		},
		{
			id: 'med-memantine-001',
			name: 'Memantine',
			dosage: '5 mg',
			frequency: 'Twice daily',
			instructions: 'Take with the morning and evening meals.',
			isActive: true,
		},
		{
			id: 'med-vitamin-d-001',
			name: 'Vitamin D3',
			dosage: '1000 IU',
			frequency: 'Once daily',
			instructions: 'Take after lunch.',
			isActive: true,
		},
	],
	schedule: [
		{
			id: 'schedule-morning-walk-001',
			title: 'Morning walk',
			description: 'Take a gentle walk with Priya in the apartment garden.',
			date: '2026-09-05',
			time: '07:30',
			type: 'other',
		},
		{
			id: 'schedule-doctor-visit-001',
			title: 'Memory clinic appointment',
			description: 'Routine follow-up with Dr. Ananya Sharma.',
			date: '2026-09-08',
			time: '11:00',
			type: 'appointment',
		},
		{
			id: 'schedule-family-call-001',
			title: 'Family video call',
			description: 'Call Priya and Rohan after tea.',
			date: '2026-09-05',
			time: '17:00',
			type: 'memory',
		},
	],
	familyMembers: [
		{
			id: 'family-priya-kumar-001',
			name: 'Priya Kumar',
			relationship: 'Daughter and primary caregiver',
			phone: '+91-98765-43210',
		},
		{
			id: 'family-rohan-kumar-001',
			name: 'Rohan Kumar',
			relationship: 'Grandson',
			phone: '+91-98765-12345',
		},
		{
			id: 'family-meera-kumar-001',
			name: 'Meera Kumar',
			relationship: 'Sister',
			phone: '+91-98765-67890',
		},
	],
}
