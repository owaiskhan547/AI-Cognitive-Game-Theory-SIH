import type { Difficulty } from './gameTypes'

export function calculateGameScore({
  difficulty,
  accuracy,
  elapsedSeconds,
}: {
  difficulty: Difficulty
  accuracy: number
  elapsedSeconds: number
}) {
  const safeAccuracy = Math.max(0, Math.min(1, accuracy))
  const targetSeconds: Record<Difficulty, number> = { easy: 10, medium: 30, hard: 60 }
  const target = targetSeconds[difficulty]
  const speedBonus = elapsedSeconds <= target
    ? 20
    : Math.max(0, Math.round((20 * target) / elapsedSeconds))
  const accuracyPercent = Math.round(safeAccuracy * 80)

  return Math.min(100, Math.max(0, accuracyPercent + speedBonus))
}