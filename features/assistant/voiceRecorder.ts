export class VoiceRecorder {
	private mediaRecorder: MediaRecorder | null = null
	private stream: MediaStream | null = null
	private chunks: Blob[] = []

	async requestPermission(): Promise<void> {
		try {
			this.stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false,
			})
		} catch {
			throw new Error('Microphone permission denied.')
		}
	}

	startRecording(): void {
		if (!this.stream) {
			throw new Error('Microphone permission has not been granted.')
		}
		if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
			throw new Error('Recording is already in progress.')
		}

		try {
			this.chunks = []
			this.mediaRecorder = new MediaRecorder(this.stream)
			this.mediaRecorder.addEventListener('dataavailable', (event) => {
				if (event.data.size > 0) {
					this.chunks.push(event.data)
				}
			})
			this.mediaRecorder.start()
		} catch {
			this.mediaRecorder = null
			throw new Error('Unable to start recording.')
		}
	}

	isRecording(): boolean {
		return this.mediaRecorder?.state === 'recording'
	}

	async stopRecording(): Promise<Blob> {
		if (!this.mediaRecorder || !this.isRecording()) {
			throw new Error('Recording is not in progress.')
		}

		const mediaRecorder = this.mediaRecorder
		try {
			await new Promise<void>((resolve, reject) => {
				mediaRecorder.addEventListener('stop', () => resolve(), { once: true })
				mediaRecorder.addEventListener('error', () => reject(new Error('Unable to stop recording.')), { once: true })
				mediaRecorder.stop()
			})
		} catch {
			throw new Error('Unable to stop recording.')
		}

		return new Blob(this.chunks, { type: 'audio/webm' })
	}

	public cleanup(): void {
		this.stream?.getTracks().forEach((track) => track.stop())
		this.stream = null
		this.mediaRecorder = null
		this.chunks = []
	}
}

export const voiceRecorder = new VoiceRecorder()
