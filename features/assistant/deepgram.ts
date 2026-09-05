import { DeepgramClient } from '@deepgram/sdk'

/**
 * Service class for interacting with Deepgram Voice AI (STT & TTS).
 */
export class DeepgramService {
  private client: DeepgramClient | null = null

  constructor() {
    const key = import.meta.env.VITE_DEEPGRAM_API_KEY

    if (key && typeof key === 'string' && key.trim() !== '') {
      this.client = new DeepgramClient({ apiKey: key.trim() })
    }
  }

  /**
   * Transcribes speech audio Blob to text using Deepgram.
   *
   * @param audio - Audio recording as a Blob.
   * @returns Trimmed transcript string, or empty string if none found.
   */
  async speechToText(audio: Blob): Promise<string> {
    if (!audio || audio.size === 0) {
      throw new Error('Audio data cannot be empty.')
    }
    if (!this.client) {
      throw new Error('Missing Deepgram API Key: Please define VITE_DEEPGRAM_API_KEY in your .env.local file.')
    }

    try {
      const response = await this.client.listen.v1.media.transcribeFile(audio, {
        model: 'nova-2',
        smart_format: true,
      })

      if ('results' in response && response.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
        return response.results.channels[0].alternatives[0].transcript.trim()
      }

      return ''
    } catch (error) {
      console.error('Deepgram speechToText error:', error)
      throw new Error('Failed to transcribe audio.')
    }
  }

  /**
   * Converts text to natural speech audio using Deepgram TTS.
   *
   * @param text - Text to synthesize.
   * @returns Synthesized audio as a Blob.
   */
  async textToSpeech(text: string): Promise<Blob> {
    if (!text || text.trim() === '') {
      throw new Error('Text to synthesize cannot be empty.')
    }
    if (!this.client) {
      throw new Error('Missing Deepgram API Key: Please define VITE_DEEPGRAM_API_KEY in your .env.local file.')
    }

    try {
      const response = await this.client.speak.v1.audio.generate({
        text: text.trim(),
        model: 'aura-asteria-en',
      })

      if (response && typeof response.blob === 'function') {
        const audioBlob = await response.blob()
        if (audioBlob) {
          return audioBlob
        }
      }

      throw new Error('Deepgram returned an empty audio response.')
    } catch (error) {
      console.error('Deepgram textToSpeech error:', error)
      throw new Error('Failed to synthesize speech.')
    }
  }
}

/**
 * Singleton instance of DeepgramService.
 */
export const deepgramService = new DeepgramService()
