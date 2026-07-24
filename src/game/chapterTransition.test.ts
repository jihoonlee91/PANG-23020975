import { describe, expect, it } from 'vitest'
import { getChapterLabel } from './chapterTransition'

describe('getChapterLabel', () => {
  it.each([
    [0, 'Mt. Fuji (Japan)', 'World Tour: First Flight'],
    [10, 'Neuschwanstein (Germany)', 'World Tour: Grand Circuit'],
    [20, 'Great Wall of China (China)', 'World Tour II'],
    [30, 'Neon Megacity (Dimension X)', 'Dimension X'],
    [40, 'Kelp Gate (The Trench)', 'The Trench'],
    [50, 'Ember Nebula (Stellar Forge)', 'Stellar Forge'],
    [200, 'Eclipse Zero (Hidden Finale)', 'Hidden Finale'],
  ] as const)('labels stage %i as %s', (stageIndex, stageName, expected) => {
    expect(getChapterLabel(stageIndex, stageName)).toBe(expected)
  })
})
