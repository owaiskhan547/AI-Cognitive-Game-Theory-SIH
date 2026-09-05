import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateGameScore } from './scoreEngine'
import { GameStatus } from './GameStatus'
import { useGameTimer } from './useGameTimer'
import type { GameProps } from './gameTypes'

const symbols = ['sun', 'tree', 'heart', 'star', 'flower', 'moon', 'home', 'bird']

export function MemoryMatch({ difficulty, onComplete, onExit }: GameProps) {
  const pairCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8
  const cards = useMemo(() => [...symbols.slice(0, pairCount), ...symbols.slice(0, pairCount)].sort(() => Math.random() - 0.5), [pairCount])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const timer = useGameTimer()

  const chooseCard = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return
    const nextFlipped = [...flipped, index]
    setFlipped(nextFlipped)
    if (nextFlipped.length !== 2) return
    const nextMoves = moves + 1
    setMoves(nextMoves)
    if (cards[nextFlipped[0]] === cards[nextFlipped[1]]) {
      const nextMatched = [...matched, ...nextFlipped]
      setMatched(nextMatched)
      setFlipped([])
      if (nextMatched.length === cards.length) {
        timer.stop()
        onComplete({ score: calculateGameScore({ difficulty, accuracy: cards.length / (nextMoves * 2), elapsedSeconds: timer.elapsedSeconds }), durationSeconds: timer.elapsedSeconds, correctAnswers: cards.length / 2, totalAnswers: cards.length / 2 })
      }
    } else {
      window.setTimeout(() => setFlipped([]), 700)
    }
  }

  return <div className="space-y-6"><GameStatus seconds={timer.elapsedSeconds} onExit={onExit} /><Card><CardHeader><CardTitle>Find all the matching pairs</CardTitle></CardHeader><CardContent className="grid grid-cols-4 gap-3 sm:gap-4">{cards.map((symbol, index) => { const visible = flipped.includes(index) || matched.includes(index); return <Button key={`${symbol}-${index}`} variant={visible ? 'secondary' : 'outline'} className="h-20 text-2xl sm:h-24" aria-label={visible ? symbol : 'Hidden card'} onClick={() => chooseCard(index)}>{visible ? symbol : '?'}</Button> })}</CardContent></Card></div>
}