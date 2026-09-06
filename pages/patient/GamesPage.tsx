import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { submitGameScore } from '@/src/services/gamesService'
import { GamesHome } from '@/src/components/games/GamesHome'
import { MemoryMatch } from '@/src/components/games/MemoryMatch'
import { SequenceRecall } from '@/src/components/games/SequenceRecall'
import { PatternRecall } from '@/src/components/games/PatternRecall'
import { WordRecall } from '@/src/components/games/WordRecall'
import { formatGameTime } from '@/src/components/games/useGameTimer'
import type { Difficulty, GameResult, GameType } from '@/src/components/games/gameTypes'

export default function PatientGamesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [activeGame, setActiveGame] = useState<GameType | null>(null)
  const [lastResult, setLastResult] = useState<GameResult | null>(null)

  const finishGame = async (gameType: GameType, result: GameResult) => {
    setLastResult(result)
    if (!user) return
    try {
      await submitGameScore({ profileId: user.id, gameType, difficulty, score: result.score, durationSeconds: result.durationSeconds })
      toast({ title: 'Score saved', description: `You scored ${result.score}%.` })
    } catch (error) {
      console.error('Unable to save game score:', error)
      toast({ title: 'Game complete', description: 'Your score could not be saved right now.' })
    }
  }

  const resultMessage = lastResult && lastResult.correctAnswers === lastResult.totalAnswers
    ? 'Excellent work! You got every answer right!'
    : lastResult && lastResult.correctAnswers > 0
      ? `Nice try! You got ${lastResult.correctAnswers} out of ${lastResult.totalAnswers} right. Keep practicing!`
      : 'Better luck next time! Take a breath and try again.'

  const gameProps = { difficulty, onComplete: (result: GameResult) => activeGame && finishGame(activeGame, result), onExit: () => setActiveGame(null) }

  return (
    <div className="space-y-6">
      <PageHeader title="Brain Games" subtitle="Keep your mind active and engaged" backHref="/patient/dashboard" />
      {activeGame === null ? <>
        {lastResult && <Card className="border-primary/30"><CardHeader><CardTitle>{lastResult.correctAnswers === lastResult.totalAnswers ? 'Congratulations!' : 'Game complete'}</CardTitle></CardHeader><CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-lg font-medium">{resultMessage}</p><p className="mt-1 text-muted-foreground">Your score: <strong>{lastResult.score}%</strong> <span className="ml-3">Time: <strong>{formatGameTime(lastResult.durationSeconds)}</strong></span></p></div><Button variant="outline" onClick={() => setLastResult(null)}>Dismiss</Button></CardContent></Card>}
        <GamesHome difficulty={difficulty} onDifficultyChange={setDifficulty} onSelectGame={setActiveGame} />
      </> : lastResult ? <Card className="border-primary/30"><CardHeader><CardTitle className="text-2xl">{lastResult.correctAnswers === lastResult.totalAnswers ? 'Congratulations!' : 'Game complete'}</CardTitle></CardHeader><CardContent className="space-y-6"><div><p className="text-xl font-medium">{resultMessage}</p><div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-lg text-muted-foreground"><span>Score: <strong className="text-foreground">{lastResult.score}%</strong></span><span>Time: <strong className="text-foreground">{formatGameTime(lastResult.durationSeconds)}</strong></span><span>Correct: <strong className="text-foreground">{lastResult.correctAnswers}/{lastResult.totalAnswers}</strong></span></div></div><div className="flex flex-col gap-3 sm:flex-row"><Button size="xl" onClick={() => setLastResult(null)}>Play again</Button><Button size="xl" variant="outline" onClick={() => { setLastResult(null); setActiveGame(null) }}>Back to games</Button></div></CardContent></Card> : activeGame === 'memory_match' ? <MemoryMatch {...gameProps} /> : activeGame === 'sequence_recall' ? <SequenceRecall {...gameProps} /> : activeGame === 'pattern_recall' ? <PatternRecall {...gameProps} /> : <WordRecall {...gameProps} />}
    </div>
  )
}
