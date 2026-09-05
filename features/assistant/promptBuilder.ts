export interface HistoryMessage {
  sender?: string
  role?: string
  content: string
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
  patientContext: string | null | undefined,
  conversationHistory: HistoryMessage[],
  userMessage: string
): string {
  const parts: string[] = []

  // 1. System Prompt
  parts.push(`[System Instructions]\n${systemPrompt.trim()}`)

  // 2. Patient Context (optional)
  if (patientContext && patientContext.trim()) {
    parts.push(`[Patient Context]\n${patientContext.trim()}`)
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
