export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameType =
  | 'memory_match'
  | 'sequence_recall'
  | 'pattern_recall'
  | 'word_recall'

export interface GameResult {
  score: number
  durationSeconds: number
  correctAnswers: number
  totalAnswers: number
}

export interface GameProps {
  difficulty: Difficulty
  onComplete: (result: GameResult) => void
  onExit: () => void
}