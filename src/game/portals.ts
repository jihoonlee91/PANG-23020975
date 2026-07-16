import { CANVAS_WIDTH, LEVEL_RADIUS } from './constants'
import type { Ball } from './types'

export const PORTAL_START_STAGE = 20
export const PORTAL_RADIUS = 30
export const PORTAL_COOLDOWN_MS = 900

export type Portal = {
  x: number
  y: number
  color: string
  label: string
}

export type PortalPair = {
  entry: Portal
  exit: Portal
}

export type PortalTransition = {
  from: Portal
  to: Portal
}

export function getStagePortals(stageIndex: number): readonly PortalPair[] {
  if (stageIndex < PORTAL_START_STAGE) return []

  const offset = stageIndex - PORTAL_START_STAGE
  const firstPair: PortalPair = {
    entry: {
      x: 125 + (offset % 3) * 34,
      y: 155 + (offset % 4) * 34,
      color: '#22d3ee',
      label: 'A',
    },
    exit: {
      x: 835 - (offset % 3) * 38,
      y: 350 - (offset % 4) * 30,
      color: '#f472b6',
      label: 'A',
    },
  }

  if (stageIndex < 25) return [firstPair]

  const secondPair: PortalPair = {
    entry: {
      x: 350 + (offset % 2) * 48,
      y: 120 + (offset % 3) * 38,
      color: '#a78bfa',
      label: 'B',
    },
    exit: {
      x: 610 - (offset % 2) * 42,
      y: 390 - (offset % 3) * 42,
      color: '#facc15',
      label: 'B',
    },
  }

  return [firstPair, secondPair]
}

export function findPortalTransition(
  ball: Ball,
  pairs: readonly PortalPair[],
): PortalTransition | null {
  const collisionRadius = PORTAL_RADIUS + LEVEL_RADIUS[ball.level]
  const collisionRadiusSquared = collisionRadius * collisionRadius

  for (const pair of pairs) {
    const entryDx = ball.x - pair.entry.x
    const entryDy = ball.y - pair.entry.y
    if (entryDx * entryDx + entryDy * entryDy <= collisionRadiusSquared) {
      return { from: pair.entry, to: pair.exit }
    }

    const exitDx = ball.x - pair.exit.x
    const exitDy = ball.y - pair.exit.y
    if (exitDx * exitDx + exitDy * exitDy <= collisionRadiusSquared) {
      return { from: pair.exit, to: pair.entry }
    }
  }

  return null
}

export function teleportBall(ball: Ball, destination: Portal): Ball {
  const radius = LEVEL_RADIUS[ball.level]
  const exitsOnLeft = destination.x < CANVAS_WIDTH / 2
  const horizontalOffset = PORTAL_RADIUS + radius + 5

  return {
    ...ball,
    x: destination.x + (exitsOnLeft ? horizontalOffset : -horizontalOffset),
    y: destination.y,
    vx: exitsOnLeft ? Math.abs(ball.vx) : -Math.abs(ball.vx),
    vy: -Math.max(180, Math.abs(ball.vy) * 0.7),
  }
}
