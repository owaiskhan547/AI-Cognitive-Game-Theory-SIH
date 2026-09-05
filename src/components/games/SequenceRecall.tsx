import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateGameScore } from './scoreEngine'
import { GameStatus } from './GameStatus'
import { useGameTimer } from './useGameTimer'
import type { GameProps } from './gameTypes'

export function SequenceRecall({ difficulty, onComplete, onExit }: GameProps) {
  const length = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7
  const sequence = useMemo(() => Array.from({ length }, () => Math.floor(Math.random() * 9) + 1), [length])
  const [showing, setShowing] = useState(true)
  const [answer, setAnswer] = useState<number[]>([])
  const timer = useGameTimer()

  useEffect(() => { const timeout = window.setTimeout(() => setShowing(false), 1300 + length * 250); return () => window.clearTimeout(timeout) }, [length])

  const chooseNumber = (number: number) => {
    if (showing) return
    if (answer.includes(number)) {
      setAnswer(answer.filter(value => value !== number))
      return
    }
    if (answer.length === sequence.length) return
    const nextAnswer = [...answer, number]
    setAnswer(nextAnswer)
    if (nextAnswer.length === sequence.length) {
      timer.stop()
      const correct = nextAnswer.filter((value, index) => value === sequence[index]).length
      onComplete({ score: calculateGameScore({ difficulty, accuracy: correct / sequence.length, elapsedSeconds: timer.elapsedSeconds }), durationSeconds: timer.elapsedSeconds, correctAnswers: correct, totalAnswers: sequence.length })
    }
  }

  return <div className="space-y-6"><GameStatus seconds={timer.elapsedSeconds} onExit={onExit} /><Card><CardHeader><CardTitle>{showing ? 'Watch the sequence' : 'Repeat the sequence'}</CardTitle></CardHeader><CardContent className="space-y-6"><div className="flex min-h-20 items-center justify-center gap-3 rounded-lg bg-muted p-4 text-4xl font-bold" aria-live="polite">{showing ? sequence.join('  ') : answer.length ? answer.join('  ') : '...'}</div><div className="grid grid-cols-3 gap-3">{Array.from({ length: 9 }, (_, index) => index + 1).map(number => <Button key={number} size="xl" variant="outline" disabled={showing} onClick={() => chooseNumber(number)}>{number}</Button>)}</div></CardContent></Card></div>
}