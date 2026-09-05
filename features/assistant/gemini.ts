import { GoogleGenAI } from '@google/genai'

/**
 * Service class for interacting with the Google Gemini AI model.
 */
export class GeminiService {
  private client: GoogleGenAI

  constructor() {
    const key = import.meta.env.VITE_GEMINI_API_KEY

    if (!key || typeof key !== 'string' || key.trim() === '') {
      throw new Error(
        'Missing Gemini API Key: Please set VITE_GEMINI_API_KEY in your .env.local file.'
      )
    }

    this.client = new GoogleGenAI({ apiKey: key.trim() })
  }

  /**
   * Generates a response using the gemini-2.5-flash model.
   *
   * @param prompt - Formatted prompt string.
   * @returns Trimmed generated text or fallback message.
   */
  async generateResponse(prompt: string): Promise<string> {
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt cannot be empty.')
    }

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt.trim(),
      })

      const text = response.text?.trim()

      if (!text) {
        return "I'm sorry, I couldn't generate a response."
      }

      return text
    } catch (error) {
      console.error('Gemini generateResponse error:', error)
      throw new Error('Failed to generate AI response.')
    }
  }
}

/**
 * Singleton instance of GeminiService.
 */
export const geminiService = new GeminiService()
