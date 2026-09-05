import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateGameScore } from './scoreEngine'
import { GameStatus } from './GameStatus'
import { useGameTimer } from './useGameTimer'
import type { GameProps } from './gameTypes'

export function PatternRecall({ difficulty, onComplete, onExit }: GameProps) {
  const length = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7
  const pattern = useMemo(() => Array.from({ length: 16 }, (_, index) => index).sort(() => Math.random() - 0.5).slice(0, length), [length])
  const [showing, setShowing] = useState(true)
  const [answer, setAnswer] = useState<number[]>([])
  const timer = useGameTimer()

  useEffect(() => { const timeout = window.setTimeout(() => setShowing(false), 1400 + length * 180); return () => window.clearTimeout(timeout) }, [length])

  const chooseCell = (index: number) => {
    if (showing) return
    if (answer.includes(index)) {
      setAnswer(answer.filter(value => value !== index))
      return
    }
    if (answer.length === pattern.length) return
    const nextAnswer = [...answer, index]
    setAnswer(nextAnswer)
    if (nextAnswer.length === pattern.length) {
      timer.stop()
      const correct = nextAnswer.filter((value, position) => value === pattern[position]).length
      onComplete({ score: calculateGameScore({ difficulty, accuracy: correct / pattern.length, elapsedSeconds: timer.elapsedSeconds }), durationSeconds: timer.elapsedSeconds, correctAnswers: correct, totalAnswers: pattern.length })
    }
  }

  return <div className="space-y-6"><GameStatus seconds={timer.elapsedSeconds} onExit={onExit} /><Card><CardHeader><CardTitle>{showing ? 'Remember the glowing pattern' : 'Repeat the pattern'}</CardTitle></CardHeader><CardContent className="grid grid-cols-4 gap-3">{Array.from({ length: 16 }, (_, index) => { const active = (showing ? pattern : answer).includes(index); return <Button key={index} aria-label={`Pattern square ${index + 1}`} variant={active ? 'default' : 'outline'} className="aspect-square h-auto" onClick={() => chooseCell(index)} disabled={showing}>{index + 1}</Button> })}</CardContent></Card></div>
}