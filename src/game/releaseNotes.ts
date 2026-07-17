export type ReleaseNote = {
  version: string
  date: string
  notes: string[]
}

// Newest first. Written for players, not developers — keep it short and
// skip internal-only changes (chores, test-only commits). Only the most
// recent releases are kept; older entries can be dropped.
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: '1.13.0',
    date: '2026-07-17',
    notes: [
      '10 new stages! Cosmic Frontier (51-60) travels outward from the solar system through the galaxy into deep space, ending on a Hellfire finale.',
    ],
  },
  {
    version: '1.12.1',
    date: '2026-07-17',
    notes: [
      'Fixed AI Play permanently freezing if it died on stage 1 (the attract loop now always recovers, no matter which stage it dies on).',
    ],
  },
  {
    version: '1.12.0',
    date: '2026-07-17',
    notes: [
      'AI Play clears balls much faster now — it commits to shots instead of over-cautiously avoiding the very ball it just aimed at.',
      'AI Play also plays smarter around items: no false predictions during Clock/Hourglass, and it plays fearless while Invincible is active.',
    ],
  },
  {
    version: '1.11.0',
    date: '2026-07-17',
    notes: [
      'AI Play dodges much more reliably now — it plans further ahead and searches for genuinely safe ground instead of just nudging away from danger.',
    ],
  },
  {
    version: '1.10.0',
    date: '2026-07-17',
    notes: [
      'Watch AI Play is a real playthrough now: the AI takes damage, dodges incoming balls, and can lose a run — no more scripted invincibility.',
    ],
  },
  {
    version: '1.9.0',
    date: '2026-07-17',
    notes: [
      'New item: Stabilizer. From stage 31 onward, it neutralizes the current/gravity-well hazard for 8 seconds.',
    ],
  },
  {
    version: '1.8.0',
    date: '2026-07-17',
    notes: ['Added this "What\'s New" screen, in Settings.'],
  },
]
