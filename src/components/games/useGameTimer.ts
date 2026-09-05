import { useCallback, useEffect, useRef, useState } from 'react'

export function useGameTimer(autoStart = true) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(autoStart)
  const startedAtRef = useRef(autoStart ? Date.now() : null)

  useEffect(() => {
    if (!isRunning) return
    const timer = window.setInterval(() => {
      if (startedAtRef.current) {
        setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000))
      }
    }, 250)
    return () => window.clearInterval(timer)
  }, [isRunning])

  const start = useCallback(() => {
    startedAtRef.current = Date.now() - elapsedSeconds * 1000
    setIsRunning(true)
  }, [elapsedSeconds])

  const stop = useCallback(() => setIsRunning(false), [])

  const reset = useCallback(() => {
    startedAtRef.current = Date.now()
    setElapsedSeconds(0)
    setIsRunning(true)
  }, [])

  return { elapsedSeconds, isRunning, start, stop, reset }
}

export function formatGameTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainingSeconds}`
}