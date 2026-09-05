import { Brain, Grid3X3, ListOrdered, Sparkles, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Difficulty, GameType } from './gameTypes'

const games: Array<{ type: GameType; title: string; description: string; icon: typeof Brain }> = [
  { type: 'memory_match', title: 'Memory Match', description: 'Find the matching pairs.', icon: Brain },
  { type: 'sequence_recall', title: 'Sequence Recall', description: 'Watch and repeat the number sequence.', icon: ListOrdered },
  { type: 'pattern_recall', title: 'Pattern Recall', description: 'Remember and repeat the glowing pattern.', icon: Grid3X3 },
  { type: 'word_recall', title: 'Word Recall', description: 'Remember the words and choose them in order.', icon: Type },
]

export function GamesHome({ difficulty, onDifficultyChange, onSelectGame }: { difficulty: Difficulty; onDifficultyChange: (difficulty: Difficulty) => void; onSelectGame: (game: GameType) => void }) {
  return <div className="space-y-6">
    <Card className="border-primary/20 bg-primary/5"><CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="flex items-center gap-2 text-lg font-semibold"><Sparkles className="size-5 text-primary" /> Choose a game</p><p className="mt-1 text-muted-foreground">Take your time and enjoy a short memory exercise.</p></div><div className="flex flex-wrap gap-2" role="group" aria-label="Difficulty"><span className="self-center pr-1 font-medium">Level:</span>{(['easy', 'medium', 'hard'] as Difficulty[]).map(level => <Button key={level} size="lg" variant={difficulty === level ? 'default' : 'outline'} onClick={() => onDifficultyChange(level)}>{level[0].toUpperCase() + level.slice(1)}</Button>)}</div></CardContent></Card>
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{games.map(({ type, title, description, icon: Icon }) => <Card key={type} className="flex flex-col"><CardHeader><Icon className="mb-2 size-9 text-primary" /><CardTitle className="text-2xl">{title}</CardTitle></CardHeader><CardContent className="flex flex-1 flex-col justify-between gap-6"><p className="text-lg text-muted-foreground">{description}</p><Button size="xl" className="h-16 w-full text-lg" onClick={() => onSelectGame(type)}>Play {title}</Button></CardContent></Card>)}</div>
  </div>
}