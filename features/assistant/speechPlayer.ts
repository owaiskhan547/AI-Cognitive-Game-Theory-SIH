export class SpeechPlayer {
	private readonly audio: HTMLAudioElement = new Audio()
	private currentObjectUrl: string | null = null
	private playbackReject: ((reason?: unknown) => void) | null = null

	async play(audio: Blob): Promise<void> {
		this.stop()
		const objectUrl = URL.createObjectURL(audio)
		this.currentObjectUrl = objectUrl

		await new Promise<void>((resolve, reject) => {
			const cleanup = (): void => {
				if (this.currentObjectUrl === objectUrl) {
					URL.revokeObjectURL(objectUrl)
					this.currentObjectUrl = null
				}
				this.audio.onended = null
				this.audio.onerror = null
				if (this.playbackReject === reject) {
					this.playbackReject = null
				}
			}

			this.audio.onended = () => {
				cleanup()
				resolve()
			}
			this.audio.onerror = () => {
				cleanup()
				reject(new Error('Audio playback failed.'))
			}
			this.playbackReject = (reason) => {
				cleanup()
				reject(reason ?? new Error('Audio playback stopped.'))
			}
			this.audio.src = objectUrl

			void this.audio.play().catch(() => {
				cleanup()
				reject(new Error('Audio playback failed.'))
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
