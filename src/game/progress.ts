import { STAGE_COUNT } from './constants'

const UNLOCK_KEY = 'pang.highest_unlocked_stage.v1'
const SCORE_HISTORY_KEY = 'pang_scores'

function clampStage(stageIndex: number) {
  return Math.min(STAGE_COUNT - 1, Math.max(0, Math.floor(stageIndex)))
}

export function getHighestUnlockedStage(): number {
  try {
    const stored = Number(localStorage.getItem(UNLOCK_KEY) ?? 0)
    const scoreHistory = JSON.parse(
      localStorage.getItem(SCORE_HISTORY_KEY) ?? '[]',
    ) as Array<{ stageReached?: number }>
    const historyUnlock = Array.isArray(scoreHistory)
      ? Math.max(
          0,
          ...scoreHistory.map((entry) => (entry.stageReached ?? 1) - 1),
        )
      : 0
    return clampStage(Math.max(stored, historyUnlock))
  } catch {
    return 0
  }
}

export function unlockStage(stageIndex: number): number {
  const highest = Math.max(getHighestUnlockedStage(), clampStage(stageIndex))
  localStorage.setItem(UNLOCK_KEY, String(highest))
  return highest
}
