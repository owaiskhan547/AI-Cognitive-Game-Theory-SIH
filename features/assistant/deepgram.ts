/**
 * Service class for interacting with Deepgram Voice AI (STT & TTS).
 * Uses direct fetch for maximum reliability across browsers without Node SDK overhead.
 */
export class DeepgramService {
  private apiKey: string = ''

  constructor() {
    const key =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEEPGRAM_API_KEY) ||
      (typeof process !== 'undefined' && process.env?.VITE_DEEPGRAM_API_KEY) ||
      ''

    if (key && typeof key === 'string' && key.trim() !== '') {
      this.apiKey = key.trim()
    }
  }

  /**
   * Transcribes speech audio Blob to text using Deepgram REST API.
   *
   * @param audio - Audio recording as a Blob.
   * @returns Trimmed transcript string, or empty string if none found.
   */
  async speechToText(audio: Blob): Promise<string> {
    if (!audio || audio.size === 0) {
      return ''
    }

    if (!this.apiKey) {
      console.warn('Missing Deepgram API Key. Set VITE_DEEPGRAM_API_KEY in your .env.local file.')
      return ''
    }

    try {
      const response = await fetch(
        'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true',
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${this.apiKey}`,
            'Content-Type': audio.type || 'audio/webm',
          },
          body: audio,
        }
      )

      if (!response.ok) {
        const errText = await response.text()
        console.error('Deepgram STT error response:', response.status, errText)
        return ''
      }

      const result = await response.json()
      const transcript =
        result?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() || ''

      return transcript
    } catch (error) {
      console.error('Deepgram speechToText error:', error)
      return ''
    }
  }

  /**
   * Converts text to natural speech audio using Deepgram TTS REST API.
   *
   * @param text - Text to synthesize.
   * @returns Synthesized audio as a Blob.
   */
  async textToSpeech(text: string): Promise<Blob> {
    if (!text || text.trim() === '') {
      throw new Error('Text to synthesize cannot be empty.')
    }

    if (!this.apiKey) {
      throw new Error('Missing Deepgram API Key: Please define VITE_DEEPGRAM_API_KEY in your .env.local file.')
    }

    try {
      const response = await fetch(
        'https://api.deepgram.com/v1/speak?model=aura-asteria-en&encoding=mp3',
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: text.trim() }),
        }
      )

      if (!response.ok) {
        const errText = await response.text()
        console.error('Deepgram TTS error response:', response.status, errText)
        throw new Error(`Deepgram TTS failed: ${response.status}`)
      }

      const audioBlob = await response.blob()
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Deepgram returned an empty audio response.')
      }

      return audioBlob
    } catch (error) {
      console.error('Deepgram textToSpeech error:', error)
      throw error
    }
  }
}

/**
 * Singleton instance of DeepgramService.
 */
export const deepgramService = new DeepgramService()
