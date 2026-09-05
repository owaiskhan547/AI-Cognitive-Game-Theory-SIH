import type { Database } from '@/types/database.types'
export type CaregiverRow = Database['public']['Tables']['caregivers']['Row']
export type CaregiverPatientRow = Database['public']['Tables']['caregiver_patients']['Row']
export type GameScoreRow = Database['public']['Tables']['game_scores']['Row']
export type ReminderType = 'medication' | 'game' | 'appointment' | 'memory' | 'routine'
export type DateRange = 7 | 30 | 90
export interface AssignedPatientSummary { patientId: string; fullName: string; dob: string | null; avatarUrl: string | null; relationship: string | null; emergencyContact: string | null; medicalNotes: string | null }
export interface PatientOverview extends AssignedPatientSummary { age: number | null; latestActivityAt: string | null; activeMedications: number; upcomingReminders: number }
export interface CaregiverStats { averageScore: number | null; bestScore: number | null; gamesPlayed: number; averageDurationSeconds: number | null; activeMedications: number; upcomingReminders: number; medicationAdherence: null }
export interface ProgressPoint { date: string; score: number; gamesPlayed: number }
export interface GameScoreSummary { gameType: string; difficulty: string; averageScore: number; gamesPlayed: number }
export interface CaregiverActivity { id: string; activity: string; type: 'game' | 'schedule' | 'memory' | 'assistant'; score: number | null; occurredAt: string }
export interface Reminder { id: string; patientId: string; title: string; description: string | null; date: string; time: string; type: string; createdAt: string }
export interface ReminderFormData { title: string; description: string; date: string; time: string; type: ReminderType }
export interface ProgressSummary extends CaregiverStats { trend: ProgressPoint[]; byGameType: GameScoreSummary[]; byDifficulty: GameScoreSummary[]; recentScores: GameScoreRow[] }
export interface ProgressReport { period: 'weekly' | 'monthly'; stats: CaregiverStats; reminderCount: number; activities: CaregiverActivity[] }
