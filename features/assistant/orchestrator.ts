import { markMedicationTaken, markScheduleCompleted, triggerSOS } from '@/lib/services/patientService'
import { ConversationManager } from './conversation'
import { geminiService } from './gemini'
import { patientContextService } from './patientContextService'
import { SYSTEM_PROMPT } from './prompt'
import { buildPrompt } from './promptBuilder'
import type {
  AssistantAction,
  AssistantIntent,
  AssistantOrchestrationResult,
  PatientContext,
} from './types'

const safetyPattern = /\b(fall|fell|fallen|can't get up|cannot get up|unconscious|chest pain|breath(?:ing)? difficulty|can't breathe|cannot breathe|severe injury|serious injury|severe bleeding|serious emergency|emergency)\b/i

function detectIntent(message: string): AssistantIntent {
  const text = message.toLowerCase()
  if (safetyPattern.test(text)) return 'emergency'
  if (/\b(medicine|medication|pill|dose|taken|take)\b/.test(text)) return 'medication'
  if (/\b(schedule|doing|next|now|what should i do|forgot|remember what i was doing|appointment)\b/.test(text)) return 'orientation'
  if (/\b(game|play|cognitive|memory match|word recall|pattern)\b/.test(text)) return 'cognitive_game'
  if (/\b(caregiver|daughter|son|family|who is)\b/.test(text)) return text.includes('caregiver') ? 'caregiver' : 'family'
  if (/\b(memory|remember|park|photo|picture)\b/.test(text)) return 'memory'
  if (/\b(confused|worried|sad|lonely|scared|help)\b/.test(text)) return 'emotional_support'
  return 'general'
}

function isCompletionConfirmation(message: string): boolean {
  return /\b(i (took|did|finished|completed)|taken|done|completed|finished)\b/i.test(message)
}

function safeAction(intent: AssistantIntent, message: string, context: PatientContext): AssistantAction {
  const text = message.toLowerCase()
  if (intent === 'cognitive_game' && /\b(play|start|begin)\b/.test(text)) return 'start_game'
  if (intent === 'medication' && isCompletionConfirmation(message)) return 'mark_medication'
  if (intent === 'schedule' && isCompletionConfirmation(message)) return 'mark_activity'
  return 'none'
}

function nextSchedule(context: PatientContext) {
  return context.schedule.find((item) => !item.isCompleted && item.date === new Date().toISOString().slice(0, 10))
    ?? context.schedule.find((item) => !item.isCompleted)
}

function localResponse(intent: AssistantIntent, message: string, context: PatientContext): string {
  const firstName = context.name.split(/\s+/)[0]
  const next = nextSchedule(context)
  const text = message.toLowerCase()

  if (intent === 'orientation') {
    if (next) return `That's okay, ${firstName}. Your next activity is ${next.title} at ${next.time}. Let's take that one step together.`
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('smriti:highlight-voice-assistant'))
    return `That's okay, ${firstName}. I don't see another activity recorded right now. Please tap the microphone button if you would like me to help you.`
  }
  if (intent === 'medication') {
    const medication = context.medications.find((item) => text.includes(item.name.toLowerCase()))
    if (text.includes('did i') || text.includes('taken') || text.includes('take')) {
      if (medication) return medication.isTakenToday
        ? `Yes, ${medication.name} is recorded as taken today.`
        : `I don't see ${medication.name} recorded as taken today. Please follow the scheduled instructions and ask ${context.caregiverName ?? 'your caregiver'} if you are unsure.`
      return context.medications.length
        ? `I can see ${context.medications.map((item) => `${item.name} is ${item.isTakenToday ? 'recorded as taken' : 'not recorded as taken'}`).join(' and ')} today.`
        : `I don't see any active medication records right now.`
    }
    return context.medications[0]
      ? `Your next listed medicine is ${context.medications[0].name}, ${context.medications[0].dosage}. Follow the stored instructions and do not take an extra dose.`
      : `I don't see a medication record right now. Please ask ${context.caregiverName ?? 'your caregiver'}.`
  }
  if (intent === 'caregiver' || intent === 'family') {
    const person = context.familyMembers[0]
    return person ? `${person.name} is your ${person.relationship}. They are part of your care team and can help you.` : `I don't have a caregiver or family record available right now.`
  }
  if (intent === 'memory') {
    const memory = (context.memories ?? []).find((item) => `${item.title} ${item.description ?? ''}`.toLowerCase().includes(text.replace(/do you remember|remember|the|a|park/gi, '').trim()))
      ?? (text.includes('park') ? (context.memories ?? []).find((item) => `${item.title} ${item.description ?? ''}`.toLowerCase().includes('park')) : undefined)
    return memory ? `Yes, I found a stored memory called ${memory.title}${memory.description ? `: ${memory.description}` : '.'}` : `I don't have a stored memory matching that yet.`
  }
  if (intent === 'cognitive_game') return `We can play a cognitive game together. I can open the games for you now.`
  if (intent === 'emotional_support') return `You are safe, ${firstName}. Take one slow breath, and tell me one small thing you need right now.`
  return `I'm here with you, ${firstName}. Tell me what you need, and we will take it one simple step at a time.`
}

function parseGeminiResult(raw: string, fallback: AssistantOrchestrationResult): AssistantOrchestrationResult {
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()
    const parsed = JSON.parse(cleaned) as Partial<AssistantOrchestrationResult>
    const validIntents: AssistantIntent[] = ['orientation', 'medication', 'schedule', 'family', 'memory', 'cognitive_game', 'emotional_support', 'caregiver', 'emergency', 'general']
    const validActions: AssistantAction[] = ['none', 'mark_medication', 'mark_activity', 'start_game', 'notify_caregiver', 'emergency']
    return {
      response: typeof parsed.response === 'string' ? parsed.response : fallback.response,
      intent: validIntents.includes(parsed.intent as AssistantIntent) ? parsed.intent as AssistantIntent : fallback.intent,
      action: validActions.includes(parsed.action as AssistantAction) ? parsed.action as AssistantAction : fallback.action,
      emergency: Boolean(parsed.emergency) && fallback.emergency,
    }
  } catch {
    return fallback
  }
}

export class AssistantOrchestrator {
  constructor(
    private readonly conversations = new ConversationManager(),
  ) {}

  async handleMessage(message: string): Promise<AssistantOrchestrationResult> {
    const context = await patientContextService.getCurrentPatient()
    if (!context) {
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('smriti:highlight-voice-assistant'))
      return { response: 'I cannot access your patient information right now. Please tap the microphone button and tell me what you need, or ask your caregiver for help.', intent: 'general', action: 'none', emergency: false }
    }

    const intent = detectIntent(message)
    if (intent === 'emergency') {
      try {
        await triggerSOS(context.patientId)
      } catch (error) {
        console.error('Unable to trigger assistant SOS:', error)
      }
      const result = { response: `Please stay still and take a slow breath. I am notifying ${context.caregiverName ?? 'your caregiver'} now and help is being arranged.`, intent, action: 'emergency' as const, emergency: true }
      this.conversations.addAssistantMessage(result.response)
      return result
    }

    const action = safeAction(intent, message, context)
    const fallback: AssistantOrchestrationResult = {
      response: localResponse(intent, message, context),
      intent,
      action,
      emergency: false,
    }

    if (action === 'mark_medication') {
      const medication = context.medications.find((item) => message.toLowerCase().includes(item.name.toLowerCase())) ?? context.medications.find((item) => !item.isTakenToday)
      if (medication && !medication.isTakenToday) {
        await markMedicationTaken(context.patientId, medication.id)
        fallback.response = `${medication.name} is now recorded as taken. Please do not take an extra dose.`
      }
    }
    if (action === 'mark_activity') {
      const activity = nextSchedule(context)
      if (activity) {
        await markScheduleCompleted(context.patientId, activity.id)
        fallback.response = `${activity.title} is marked complete. You can take a gentle pause now.`
      }
    }

    this.conversations.addUserMessage(message)
    const prompt = buildPrompt(SYSTEM_PROMPT, context, this.conversations.getRecentConversation(), message)
    try {
      const raw = await geminiService.generateResponse(prompt)
      const parsed = parseGeminiResult(raw, fallback)
      parsed.intent = fallback.intent
      parsed.action = fallback.action
      parsed.emergency = false
      this.conversations.addAssistantMessage(parsed.response)
      return parsed
    } catch (error) {
      console.warn('Assistant orchestration using deterministic fallback:', error)
      this.conversations.addAssistantMessage(fallback.response)
      return fallback
    }
  }
}
