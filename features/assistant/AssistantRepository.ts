import { deepgramService } from './deepgram'
import { AssistantOrchestrator } from './orchestrator'
import type { AssistantOrchestrationResult, VoiceAssistantResponse } from './types'

/** Public assistant facade shared by text and voice clients. */
export class AssistantRepository {
  private readonly orchestrator = new AssistantOrchestrator()

  async sendMessageResult(userMessage: string): Promise<AssistantOrchestrationResult> {
    if (!userMessage.trim()) throw new Error('Message cannot be empty.')
    return this.orchestrator.handleMessage(userMessage.trim())
  }

  async sendMessage(userMessage: string): Promise<string> {
    const result = await this.sendMessageResult(userMessage)
    return result.response
  }

  async sendVoiceMessage(audio: Blob): Promise<VoiceAssistantResponse & { result?: AssistantOrchestrationResult }> {
    try {
      const transcript = await deepgramService.speechToText(audio)
      if (!transcript?.trim()) {
        const response = "I didn't quite hear you clearly. Please say that again."
        return { transcript: '(Quiet voice)', response, audio: new Blob() }
      }

      const result = await this.sendMessageResult(transcript)
      let responseAudio = new Blob()
      try {
        responseAudio = await deepgramService.textToSpeech(result.response)
      } catch (error) {
        console.warn('Deepgram response audio unavailable:', error)
      }
      return { transcript, response: result.response, audio: responseAudio, result }
    } catch (error) {
      console.error('Assistant voice orchestration failed:', error)
      const response = "I'm right here with you. Please take your time and tell me what you need."
      return { transcript: '(Speaking)', response, audio: new Blob() }
    }
  }
}

export const assistantRepository = new AssistantRepository()
