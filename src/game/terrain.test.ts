import { describe, expect, it } from 'vitest'
import { PLAYER_Y } from './constants'
import { getStageTerrain, STAGE_TERRAINS, stepPlayerOnTerrain } from './terrain'

describe('stage terrain', () => {
  it('defines multiple platforms and ladders for all 20 stages', () => {
    expect(STAGE_TERRAINS).toHaveLength(20)
    for (const terrain of STAGE_TERRAINS) {
      expect(terrain.platforms.length).toBeGreaterThanOrEqual(2)
      expect(terrain.ladders.length).toBe(terrain.platforms.length)
    }
  })

  it('moves the player upward while aligned with a ladder', () => {
    const terrain = getStageTerrain(0)
    const ladder = terrain.ladders[0]
    const next = stepPlayerOnTerrain(
      ladder.x,
      PLAYER_Y,
      { left: false, right: false, up: true, down: false },
      0.1,
      300,
      terrain,
    )

    expect(next.x).toBe(ladder.x)
    expect(next.y).toBeLessThan(PLAYER_Y)
  })

  it('keeps a player standing on an elevated platform', () => {
    const terrain = getStageTerrain(0)
    const platform = terrain.platforms[0]
    const ladder = terrain.ladders[0]
    const next = stepPlayerOnTerrain(
      ladder.x,
      ladder.topY,
      { left: true, right: false, up: false, down: false },
      2,
      300,
      terrain,
    )

    expect(next.y).toBe(ladder.topY)
    expect(next.x).toBeGreaterThanOrEqual(platform.x + 20)
  })
})
