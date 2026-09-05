import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateGameScore } from './scoreEngine'
import { GameStatus } from './GameStatus'
import { useGameTimer } from './useGameTimer'
import type { GameProps } from './gameTypes'

const wordBank = ['apple', 'garden', 'river', 'chair', 'yellow', 'book', 'morning', 'coffee', 'window', 'music']

export function WordRecall({ difficulty, onComplete, onExit }: GameProps) {
  const length = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8
  const words = useMemo(() => [...wordBank].sort(() => Math.random() - 0.5).slice(0, length), [length])
  const options = useMemo(() => [...words, ...wordBank.filter(word => !words.includes(word)).slice(0, 3)].sort(() => Math.random() - 0.5), [words])
  const [showing, setShowing] = useState(true)
  const [answer, setAnswer] = useState<string[]>([])
  const timer = useGameTimer()

  useEffect(() => { const timeout = window.setTimeout(() => setShowing(false), 3200); return () => window.clearTimeout(timeout) }, [words])

  const chooseWord = (word: string) => {
    if (showing) return
    if (answer.includes(word)) {
      setAnswer(answer.filter(value => value !== word))
      return
    }
    if (answer.length === words.length) return
    const nextAnswer = [...answer, word]
    setAnswer(nextAnswer)
    if (nextAnswer.length === words.length) {
      timer.stop()
      const correct = nextAnswer.filter((value, index) => value === words[index]).length
      onComplete({ score: calculateGameScore({ difficulty, accuracy: correct / words.length, elapsedSeconds: timer.elapsedSeconds }), durationSeconds: timer.elapsedSeconds, correctAnswers: correct, totalAnswers: words.length })
    }
  }

  return <div className="space-y-6"><GameStatus seconds={timer.elapsedSeconds} onExit={onExit} /><Card><CardHeader><CardTitle>{showing ? 'Remember these words' : 'Choose the words in order'}</CardTitle></CardHeader><CardContent className="space-y-6"><div className="flex min-h-20 flex-wrap items-center justify-center gap-3 rounded-lg bg-muted p-4 text-xl font-semibold" aria-live="polite">{showing ? words.map(word => <span key={word}>{word}</span>) : answer.map(word => <span key={word}>{word}</span>)}</div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{options.map(word => <Button key={word} size="xl" variant="outline" disabled={showing || answer.includes(word)} onClick={() => chooseWord(word)}>{word}</Button>)}</div></CardContent></Card></div>
}