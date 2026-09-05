export interface ChatMessage {
	id: string
	role: 'user' | 'assistant' | 'system'
	content: string
	createdAt: Date
	isVoice?: boolean
	metadata?: {
		audioUrl?: string
		[key: string]: unknown
	}
}

export interface ConversationHistory {
	conversationId: string
	patientId: string
	messages: ChatMessage[]
}

export interface PatientContext {
	patientId: string
	name: string
	dateOfBirth: string | null
	medicalNotes: string | null
	preferredLanguage?: string
	caregiverName?: string
	caregiverPhone?: string
	medications: Medication[]
	schedule: ScheduleItem[]
	familyMembers: FamilyMember[]
}

export interface Medication {
	id: string
	name: string
	dosage: string
	frequency: string
	instructions: string | null
	isActive: boolean
}

export interface ScheduleItem {
	id: string
	title: string
	description: string | null
	date: string
	time: string
	type: 'medication' | 'appointment' | 'game' | 'memory' | 'other'
}

export interface FamilyMember {
	id: string
	name: string
	relationship: string
	phone: string | null
}

export interface AssistantResponse {
	message: string
	suggestedActions?: string[]
	requiresHumanAttention?: boolean
	spokenText?: string
}
