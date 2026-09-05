import type { PatientContext } from './types'

export interface HistoryMessage {
  sender?: string
  role?: string
  content: string
}

function formatPatientContext(patientContext: string | PatientContext | null | undefined): string | null {
  if (!patientContext) return null
  if (typeof patientContext === 'string') return patientContext

  const activeMedications = patientContext.medications
    .filter((medication) => medication.isActive)
    .map(
      (medication) =>
        `- ${medication.name}, ${medication.dosage}, ${medication.frequency}${medication.instructions ? ` (${medication.instructions})` : ''}`
    )
    .join('\n') || '- None listed'

  const upcomingSchedule = patientContext.schedule
    .map(
      (item) =>
        `- ${item.date} at ${item.time}: ${item.title}${item.description ? ` (${item.description})` : ''}`
    )
    .join('\n') || '- None listed'

  const familyMembers = patientContext.familyMembers
    .map(
      (member) =>
        `- ${member.name} (${member.relationship})${member.phone ? `, ${member.phone}` : ''}`
    )
    .join('\n') || '- None listed'

  return [
    `Name: ${patientContext.name}`,
    `Date of Birth: ${patientContext.dateOfBirth ?? 'Not provided'}`,
    `Preferred Language: ${patientContext.preferredLanguage ?? 'Not provided'}`,
    `Medical Notes: ${patientContext.medicalNotes ?? 'Not provided'}`,
    `Caregiver Name: ${patientContext.caregiverName ?? 'Not provided'}`,
    `Caregiver Phone: ${patientContext.caregiverPhone ?? 'Not provided'}`,
    `Active Medications:\n${activeMedications}`,
    `Upcoming Schedule:\n${upcomingSchedule}`,
    `Family Members:\n${familyMembers}`,
  ].join('\n')
}

/**
 * Builds a prompt string to send to Gemini.
 *
 * Rules:
 * - Always includes the system prompt.
 * - Includes patient context only if provided.
 * - Includes only the last 6 messages from conversation history.
 * - Appends the user's latest message at the end.
 */
export function buildPrompt(
  systemPrompt: string,
  patientContext: string | PatientContext | null | undefined,
  conversationHistory: HistoryMessage[],
  userMessage: string
): string {
  const parts: string[] = []

  // 1. System Prompt
  parts.push(`[System Instructions]\n${systemPrompt.trim()}`)

  // 2. Patient Context (optional)
  const formattedPatientContext = formatPatientContext(patientContext)
  if (formattedPatientContext) {
    parts.push(`[Patient Context]\n${formattedPatientContext}`)
  }

  // 3. Last 6 messages from history
  if (conversationHistory && conversationHistory.length > 0) {
    const last6 = conversationHistory.slice(-6)
    const historyText = last6
      .map((msg) => {
        const role = (msg.role || msg.sender || '').toLowerCase()
        const speaker = role === 'assistant' || role === 'smriticare' ? 'SmritiCare' : 'User'
        return `${speaker}: ${msg.content}`
      })
      .join('\n')

    parts.push(`[Conversation History]\n${historyText}`)
  }

  // 4. Current user message
  parts.push(`[Current User Message]\nUser: ${userMessage.trim()}\nSmritiCare:`)

  return parts.join('\n\n')
}
