import {
  CANVAS_WIDTH,
  PLAYER_WIDTH,
  PLAYER_Y,
  STAGE_OBSTACLES,
  type Obstacle,
} from './constants'

export type StageTerrain = {
  platforms: readonly Obstacle[]
}

const EXTRA_PLATFORMS: readonly (readonly Obstacle[])[] = [
  [{ x: 100, y: 380, width: 220, height: 18 }],
  [{ x: 580, y: 350, width: 250, height: 18 }],
  [{ x: 100, y: 210, width: 220, height: 18 }],
  [{ x: 620, y: 210, width: 240, height: 18 }],
  [{ x: 120, y: 340, width: 230, height: 18 }],
  [{ x: 610, y: 220, width: 240, height: 18 }],
  [
    { x: 80, y: 370, width: 210, height: 18 },
    { x: 670, y: 360, width: 210, height: 18 },
  ],
  [{ x: 590, y: 220, width: 250, height: 18 }],
  [{ x: 90, y: 190, width: 230, height: 18 }],
  [
    { x: 80, y: 330, width: 220, height: 18 },
    { x: 660, y: 330, width: 220, height: 18 },
  ],
  [{ x: 610, y: 370, width: 240, height: 18 }],
  [{ x: 100, y: 360, width: 240, height: 18 }],
  [
    { x: 80, y: 200, width: 210, height: 18 },
    { x: 670, y: 210, width: 210, height: 18 },
  ],
  [{ x: 600, y: 350, width: 260, height: 18 }],
  [{ x: 100, y: 350, width: 230, height: 18 }],
  [
    { x: 70, y: 370, width: 210, height: 18 },
    { x: 680, y: 240, width: 210, height: 18 },
  ],
  [{ x: 90, y: 210, width: 220, height: 18 }],
  [{ x: 610, y: 230, width: 250, height: 18 }],
  [
    { x: 80, y: 350, width: 220, height: 18 },
    { x: 350, y: 230, width: 260, height: 18 },
  ],
  [
    { x: 60, y: 180, width: 210, height: 18 },
    { x: 690, y: 180, width: 210, height: 18 },
  ],
]

const EARLY_STAGE_TERRAINS: readonly StageTerrain[] = [
  { platforms: [] },
  { platforms: [] },
  { platforms: [{ x: 390, y: 270, width: 180, height: 18 }] },
  { platforms: [{ x: 150, y: 310, width: 210, height: 18 }] },
]

function getTargetPlatformCount(stageIndex: number): number {
  if (stageIndex < 2) return 0
  if (stageIndex < 5) return 1
  return Math.min(4, 2 + Math.floor((stageIndex - 5) / 5))
}

function getSupplementalPlatforms(stageIndex: number): readonly Obstacle[] {
  return [
    {
      x: 70 + ((stageIndex * 47) % 180),
      y: 150 + (stageIndex % 3) * 60,
      width: 150,
      height: 18,
    },
    {
      x: 650 - ((stageIndex * 41) % 120),
      y: 205 + ((stageIndex + 1) % 3) * 55,
      width: 155,
      height: 18,
    },
    {
      x: 370 + (stageIndex % 2) * 70,
      y: 145 + (stageIndex % 4) * 50,
      width: 160,
      height: 18,
    },
  ]
}

export const STAGE_TERRAINS: readonly StageTerrain[] = STAGE_OBSTACLES.map(
  (primary, stageIndex) => {
    const earlyTerrain = EARLY_STAGE_TERRAINS[stageIndex]
    if (earlyTerrain) return earlyTerrain

    const targetCount = getTargetPlatformCount(stageIndex)
    const candidates = [
      primary,
      ...(EXTRA_PLATFORMS[stageIndex] ?? []),
      ...getSupplementalPlatforms(stageIndex),
    ]
    return { platforms: candidates.slice(0, targetCount) }
  },
)

export function getStageTerrain(stageIndex: number): StageTerrain {
  const normalizedIndex =
    ((stageIndex % STAGE_TERRAINS.length) + STAGE_TERRAINS.length) %
    STAGE_TERRAINS.length
  return STAGE_TERRAINS[normalizedIndex]
}

type PlayerTerrainInput = {
  left: boolean
  right: boolean
}

export function stepPlayerOnTerrain(
  x: number,
  _y: number,
  input: PlayerTerrainInput,
  dtSec: number,
  horizontalSpeed: number,
  _terrain: StageTerrain,
): { x: number; y: number } {
  const horizontalDirection = Number(input.right) - Number(input.left)
  const nextX = Math.min(
    CANVAS_WIDTH - PLAYER_WIDTH / 2,
    Math.max(
      PLAYER_WIDTH / 2,
      x + horizontalDirection * horizontalSpeed * dtSec,
    ),
  )
  return { x: nextX, y: PLAYER_Y }
}
