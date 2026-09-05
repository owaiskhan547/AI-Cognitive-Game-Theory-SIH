import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatGameTime } from './useGameTimer'

export function GameStatus({ seconds, onExit }: { seconds: number; onExit: () => void }) {
  return <Card className="border-primary/20 bg-primary/5"><CardContent className="flex items-center justify-between gap-4 py-4"><p className="text-lg font-semibold" aria-live="polite">Time: {formatGameTime(seconds)}</p><Button variant="outline" size="lg" onClick={onExit}>Exit game</Button></CardContent></Card>
}