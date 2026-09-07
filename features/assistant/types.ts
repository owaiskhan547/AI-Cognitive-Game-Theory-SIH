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
	currentTime?: string
	memories?: StoredMemory[]
}

export interface Medication {
	id: string
	name: string
	dosage: string
	frequency: string
	instructions: string | null
	isActive: boolean
	isTakenToday?: boolean
	lastTakenAt?: string | null
}

export interface ScheduleItem {
	id: string
	title: string
	description: string | null
	date: string
	time: string
	type: 'medication' | 'appointment' | 'game' | 'memory' | 'other'
	isCompleted?: boolean
	completionStatus?: 'completed' | 'skipped' | null
}

export interface StoredMemory {
	id: string
	title: string
	description: string | null
	createdAt: string
}

export type AssistantIntent =
	| 'orientation'
	| 'medication'
	| 'schedule'
	| 'family'
	| 'memory'
	| 'cognitive_game'
	| 'emotional_support'
	| 'caregiver'
	| 'emergency'
	| 'general'

export type AssistantAction =
	| 'none'
	| 'mark_medication'
	| 'mark_activity'
	| 'start_game'
	| 'notify_caregiver'
	| 'emergency'

export interface AssistantOrchestrationResult {
	response: string
	intent: AssistantIntent
	action: AssistantAction
	emergency: boolean
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

export interface VoiceAssistantResponse {
	transcript: string
	response: string
	audio: Blob
}
