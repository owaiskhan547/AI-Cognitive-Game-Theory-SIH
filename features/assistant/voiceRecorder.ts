export class VoiceRecorder {
	private mediaRecorder: MediaRecorder | null = null
	private stream: MediaStream | null = null
	private chunks: Blob[] = []

	/** Requests and stores microphone access for recording. */
	async requestPermission(): Promise<void> {
		if (this.stream) return
		if (!navigator.mediaDevices || !window.MediaRecorder) {
			throw new Error('Voice recording is not supported by this browser.')
		}

		try {
			this.stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false,
			})
		} catch {
			throw new Error('Microphone permission denied.')
		}
	}

	/** Starts recording audio from the stored microphone stream. */
	startRecording(): void {
		if (!this.stream) {
			throw new Error('Microphone permission has not been granted.')
		}
		if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
			throw new Error('Recording is already in progress.')
		}
		this.mediaRecorder = null

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

	/** Returns whether audio recording is currently active. */
	isRecording(): boolean {
		return this.mediaRecorder?.state === 'recording'
	}

	/** Stops recording and returns the captured audio as a Blob. */
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
			const audioBlob = new Blob(this.chunks, { type: 'audio/webm' })
			return audioBlob
		} catch {
			throw new Error('Unable to stop recording.')
		} finally {
			this.cleanup()
		}
	}

	/** Stops active tracks and clears all recorder state. */
	public cleanup(): void {
		const stream = this.stream

		try {
			stream?.getTracks().forEach((track) => {
				if (track.readyState !== 'ended') {
					try {
						track.stop()
					} catch {
						// Continue cleaning up the remaining tracks.
					}
				}
			})
		} finally {
			this.stream = null
			this.mediaRecorder = null
			this.chunks = []
		}
	}
}

export const voiceRecorder = new VoiceRecorder()
