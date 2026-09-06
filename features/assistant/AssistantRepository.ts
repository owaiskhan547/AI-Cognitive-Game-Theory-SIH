import { ConversationManager } from './conversation'
import { deepgramService } from './deepgram'
import { geminiService } from './gemini'
import { patientContextService } from './patientContextService';
import { SYSTEM_PROMPT } from './prompt'
import { buildPrompt } from './promptBuilder'
import type { VoiceAssistantResponse } from './types'

/**
 * Orchestrates conversation management and AI response generation.
 */
export class AssistantRepository {
  private readonly conversationManager = new ConversationManager()
  private readonly geminiService = geminiService

  /**
   * Sends a user message, calls Gemini, records the conversation, and returns the AI response.
   */
  async sendMessage(userMessage: string): Promise<string> {
    try {
      // 1. Save the user's message using ConversationManager
      this.conversationManager.addUserMessage(userMessage)

      // 2. Get the recent conversation
      const recentConversation = this.conversationManager.getRecentConversation()

      // 3. Build the prompt
      const prompt = buildPrompt(
        SYSTEM_PROMPT,
        await patientContextService.getCurrentPatient(),
        recentConversation,
        userMessage
      )

      // 4. Call geminiService.generateResponse(prompt)
      const aiResponse = await this.geminiService.generateResponse(prompt)

      // 5. Save the AI response using ConversationManager
      this.conversationManager.addAssistantMessage(aiResponse)

      // 6. Return the AI response
      return aiResponse
    } catch (error) {
      console.error('AssistantRepository sendMessage error:', error)
      throw new Error('Unable to process AI request.')
    }
  }

  public async sendVoiceMessage(audio: Blob): Promise<VoiceAssistantResponse> {
    try {
      let transcript = await deepgramService.speechToText(audio)

      if (!transcript || !transcript.trim()) {
        const gentleNotice = "I am right here with you. I didn't quite hear you clearly, could you please say that again?"
        let audioBlob = new Blob()
        try {
          audioBlob = await deepgramService.textToSpeech(gentleNotice)
        } catch {
          // Fallback to empty blob
        }
        return {
          transcript: "(Quiet voice)",
          response: gentleNotice,
          audio: audioBlob,
        }
      }

      this.conversationManager.addUserMessage(transcript)
      const recentConversation = this.conversationManager.getRecentConversation()
      const prompt = buildPrompt(
        SYSTEM_PROMPT,
        await patientContextService.getCurrentPatient(),
        recentConversation,
        transcript
      )

      let response = ""
      try {
        response = await this.geminiService.generateResponse(prompt)
      } catch (geminiError) {
        console.warn("Gemini generation failed, using compassionate fallback:", geminiError)
        response = "I am here with you, and everything is alright. How can I help you right now?"
      }

      this.conversationManager.addAssistantMessage(response)

      let audioBlob = new Blob()
      try {
        audioBlob = await deepgramService.textToSpeech(response)
      } catch (ttsError) {
        console.warn("Deepgram TTS synthesis fallback:", ttsError)
      }

      return {
        transcript,
        response,
        audio: audioBlob,
      }
    } catch (error) {
      console.error("AssistantRepository sendVoiceMessage fallback:", error)
      const fallbackResponse = "I'm right here with you. Please take your time and let me know how I can help."
      return {
        transcript: "(Speaking)",
        response: fallbackResponse,
        audio: new Blob(),
      }
    }
  }
}

/**
 * Singleton instance of AssistantRepository.
 */
export const assistantRepository = new AssistantRepository()
