export class SpeechPlayer {
	private readonly audio: HTMLAudioElement = new Audio()
	private currentObjectUrl: string | null = null
	private playbackReject: ((reason?: unknown) => void) | null = null

	async play(audio: Blob, fallbackText?: string): Promise<void> {
		this.stop()

		if (!audio || audio.size === 0) {
			if (fallbackText && typeof window !== 'undefined' && 'speechSynthesis' in window) {
				const utterance = new SpeechSynthesisUtterance(fallbackText)
				utterance.rate = 0.9
				window.speechSynthesis.speak(utterance)
			}
			return
		}

		const objectUrl = URL.createObjectURL(audio)
		this.currentObjectUrl = objectUrl

		await new Promise<void>((resolve) => {
			const cleanup = (): void => {
				if (this.currentObjectUrl !== objectUrl) return

				URL.revokeObjectURL(objectUrl)
				this.currentObjectUrl = null
				this.audio.onended = null
				this.audio.onerror = null
				this.playbackReject = null
			}

			this.audio.onended = () => {
				cleanup()
				resolve()
			}
			this.audio.onerror = () => {
				cleanup()
				if (fallbackText && typeof window !== 'undefined' && 'speechSynthesis' in window) {
					const utterance = new SpeechSynthesisUtterance(fallbackText)
					utterance.rate = 0.9
					window.speechSynthesis.speak(utterance)
				}
				resolve()
			}
			this.playbackReject = () => {
				cleanup()
				resolve()
			}
			this.audio.src = objectUrl

			this.audio.play().catch(() => {
				cleanup()
				if (fallbackText && typeof window !== 'undefined' && 'speechSynthesis' in window) {
					const utterance = new SpeechSynthesisUtterance(fallbackText)
					utterance.rate = 0.9
					window.speechSynthesis.speak(utterance)
				}
				resolve()
			})
		})
	}

	stop(): void {
		this.playbackReject?.(new Error('Audio playback stopped.'))
		this.audio.pause()
		this.audio.currentTime = 0
		this.audio.src = ''
		if (this.currentObjectUrl) {
			URL.revokeObjectURL(this.currentObjectUrl)
			this.currentObjectUrl = null
		}
	}
}

export const speechPlayer = new SpeechPlayer()
