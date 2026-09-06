import { supabase } from '@/lib/supabase/client'
import type {
  AssignedPatientSummary,
  CaregiverActivity,
  CaregiverStats,
  DateRange,
  GameScoreRow,
  PatientOverview,
  ProgressReport,
  ProgressSummary,
  Reminder,
  ReminderFormData,
} from './types'

const fromDate = (days: number) => new Date(Date.now() - days * 86400000).toISOString()
const dateKey = (value: string | Date) => new Date(value).toISOString().slice(0, 10)
const average = (items: number[]) => (items.length ? Math.round(items.reduce((a, b) => a + b, 0) / items.length) : null)
const reminder = (row: any): Reminder => ({
  id: row.id,
  patientId: row.patient_id,
  title: row.title,
  description: row.description,
  date: row.date,
  time: row.time,
  type: row.type,
  createdAt: row.created_at,
})

export class CaregiverRepository {
  /**
   * Fetch all patients assigned to the caregiver.
   */
  static async getAssignedPatients(caregiverProfileId: string): Promise<AssignedPatientSummary[]> {
    const { data: caregiver, error: cErr } = await supabase
      .from('caregivers')
      .select('id')
      .eq('profile_id', caregiverProfileId)
      .maybeSingle()

    if (cErr || !caregiver) return []

    const { data: links, error: lErr } = await supabase
      .from('caregiver_patients')
      .select('patient_id, relationship')
      .eq('caregiver_id', caregiver.id)

    if (lErr || !links || !links.length) return []

    const ids = links.map((link) => link.patient_id)
    const { data: patients, error: patientError } = await supabase
      .from('patients')
      .select('id, profile_id, emergency_contact, medical_notes')
      .in('id', ids)

    if (patientError || !patients) return []

    const profileIds = patients.map((patient) => patient.profile_id)
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, dob, avatar_url')
      .in('id', profileIds)

    if (profileError || !profiles) return []

    return links.map((link) => {
      const patient = patients.find((item) => item.id === link.patient_id)
      const profile = profiles.find((item) => item.id === patient?.profile_id)
      return {
        patientId: link.patient_id,
        fullName: profile?.full_name ?? 'Patient',
        dob: profile?.dob ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        relationship: link.relationship,
        emergencyContact: patient?.emergency_contact ?? null,
        medicalNotes: patient?.medical_notes ?? null,
      }
    })
  }

  static async getPatientGameScores(patientId: string, range: DateRange = 30): Promise<GameScoreRow[]> {
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .eq('patient_id', patientId)
      .gte('completed_at', fromDate(range))
      .order('completed_at', { ascending: false })

    if (error) throw error
    return (data || []) as GameScoreRow[]
  }

  static async getPatientGameSessions(patientId: string, range: DateRange = 30) {
    return this.getPatientGameScores(patientId, range)
  }

  static async getPatientSchedules(patientId: string, range: DateRange = 90): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('patient_id', patientId)
      .gte('date', dateKey(new Date(Date.now() - range * 86400000)))
      .order('date')
      .order('time')

    if (error) throw error
    return (data || []).map(reminder)
  }

  static async getReminders(patientId: string): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('patient_id', patientId)
      .order('date')
      .order('time')

    if (error) throw error
    return (data || []).map(reminder)
  }

  static async getCaregiverStats(patientId: string, range: DateRange = 30): Promise<CaregiverStats> {
    const [scores, medicationResult, remindersResult] = await Promise.all([
      this.getPatientGameScores(patientId, range),
      supabase.from('medications').select('id', { count: 'exact', head: true }).eq('patient_id', patientId).eq('is_active', true),
      supabase.from('schedules').select('id', { count: 'exact', head: true }).eq('patient_id', patientId).gte('date', dateKey(new Date())),
    ])

    if (medicationResult.error) throw medicationResult.error
    if (remindersResult.error) throw remindersResult.error

    return {
      averageScore: average(scores.map((score) => score.score)),
      bestScore: scores.length ? Math.max(...scores.map((score) => score.score)) : null,
      gamesPlayed: scores.length,
      averageDurationSeconds: average(scores.map((score) => score.duration_seconds)),
      activeMedications: medicationResult.count ?? 0,
      upcomingReminders: remindersResult.count ?? 0,
      medicationAdherence: null,
    }
  }

  static async getProgressSummary(patientId: string, range: DateRange = 30): Promise<ProgressSummary> {
    const [scores, stats] = await Promise.all([
      this.getPatientGameScores(patientId, range),
      this.getCaregiverStats(patientId, range),
    ])

    const grouped = new Map<string, GameScoreRow[]>()
    scores.forEach((score) => {
      const key = dateKey(score.completed_at)
      grouped.set(key, [...(grouped.get(key) ?? []), score])
    })

    const trend = [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, entries]) => ({
        date,
        score: average(entries.map((entry) => entry.score)) ?? 0,
        gamesPlayed: entries.length,
      }))

    const summarize = (field: 'game_type' | 'difficulty') =>
      [...new Set(scores.map((s) => s[field]))].map((value) => {
        const entries = scores.filter((score) => score[field] === value)
        return {
          gameType: field === 'game_type' ? value : '',
          difficulty: field === 'difficulty' ? value : '',
          averageScore: average(entries.map((entry) => entry.score)) ?? 0,
          gamesPlayed: entries.length,
        }
      })

    return {
      ...stats,
      trend,
      byGameType: summarize('game_type'),
      byDifficulty: summarize('difficulty'),
      recentScores: scores.slice(0, 10),
    }
  }

  static async getPatientActivity(patientId: string, range: DateRange = 30): Promise<CaregiverActivity[]> {
    const since = fromDate(range)
    const [scores, schedules, memories, conversations] = await Promise.all([
      this.getPatientGameScores(patientId, range),
      supabase.from('schedules').select('id,title,date,time,type').eq('patient_id', patientId).gte('date', dateKey(new Date(since))),
      supabase.from('memories').select('id,title,created_at').eq('patient_id', patientId).gte('created_at', since),
      supabase.from('assistant_conversations').select('id,title,created_at').eq('patient_id', patientId).gte('created_at', since),
    ])

    for (const result of [schedules, memories, conversations]) {
      if (result.error) throw result.error
    }

    return [
      ...scores.map((score) => ({
        id: score.id,
        activity: score.game_type.replaceAll('_', ' '),
        type: 'game' as const,
        score: score.score,
        occurredAt: score.completed_at,
      })),
      ...(schedules.data ?? []).map((item) => ({
        id: item.id,
        activity: item.title,
        type: 'schedule' as const,
        score: null,
        occurredAt: `${item.date}T${item.time}`,
      })),
      ...(memories.data ?? []).map((item) => ({
        id: item.id,
        activity: item.title,
        type: 'memory' as const,
        score: null,
        occurredAt: item.created_at,
      })),
      ...(conversations.data ?? []).map((item) => ({
        id: item.id,
        activity: item.title || 'Assistant conversation',
        type: 'assistant' as const,
        score: null,
        occurredAt: item.created_at,
      })),
    ].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
  }

  static async createReminder(patientId: string, data: ReminderFormData): Promise<Reminder> {
    const { data: row, error } = await supabase
      .from('schedules')
      .insert({ patient_id: patientId, ...data })
      .select()
      .single()

    if (error) throw error
    return reminder(row)
  }

  static async updateReminder(id: string, data: ReminderFormData): Promise<Reminder> {
    const { data: row, error } = await supabase
      .from('schedules')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return reminder(row)
  }

  static async deleteReminder(id: string): Promise<void> {
    const { error } = await supabase.from('schedules').delete().eq('id', id)
    if (error) throw error
  }

  static async getPatientOverview(patient: AssignedPatientSummary): Promise<PatientOverview> {
    const stats = await this.getCaregiverStats(patient.patientId)
    const activity = await this.getPatientActivity(patient.patientId, 90)
    const age = patient.dob ? Math.floor((Date.now() - new Date(patient.dob).getTime()) / 31557600000) : null

    return {
      ...patient,
      age,
      latestActivityAt: activity[0]?.occurredAt ?? null,
      activeMedications: stats.activeMedications,
      upcomingReminders: stats.upcomingReminders,
    }
  }

  static async getWeeklyReport(patientId: string): Promise<ProgressReport> {
    const [stats, activities, reminders] = await Promise.all([
      this.getCaregiverStats(patientId, 7),
      this.getPatientActivity(patientId, 7),
      this.getPatientSchedules(patientId, 7),
    ])

    return {
      period: 'weekly',
      stats,
      activities,
      reminderCount: reminders.length,
    }
  }

  static async getMonthlyReport(patientId: string): Promise<ProgressReport> {
    const [stats, activities, reminders] = await Promise.all([
      this.getCaregiverStats(patientId, 30),
      this.getPatientActivity(patientId, 30),
      this.getPatientSchedules(patientId, 30),
    ])

    return {
      period: 'monthly',
      stats,
      activities,
      reminderCount: reminders.length,
    }
  }
}
