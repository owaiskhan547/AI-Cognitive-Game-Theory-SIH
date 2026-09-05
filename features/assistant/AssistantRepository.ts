import { ConversationManager } from './conversation'
import { geminiService } from './gemini'
import { SYSTEM_PROMPT } from './prompt'
import { buildPrompt } from './promptBuilder'

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
        null,
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
}

/**
 * Singleton instance of AssistantRepository.
 */
export const assistantRepository = new AssistantRepository()
