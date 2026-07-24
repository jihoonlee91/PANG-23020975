# Phase 3-2. Difficulty Curve

> This is a draft. Details will be finalized after discussion.

## Goal

- Build the difficulty escalation curve across stage progression

## Design

- Speed multiplier for stage n (0-indexed) = `1 + min(n, 79) * 0.08`
  (`createStage`, `engine.ts`) — capped at the value stage 80 already
  reached under the original 80-stage design, added when `STAGE_COUNT`
  grew past 80 so stages 81-100 (Hell, Void) differentiate through their
  own hazard (fire zones, near-zero gravity) instead of raw ball speed
  climbing unbounded into unplayable territory.
- Mission 1 (Stage 1) serves as a tutorial, with 1 ball and slow speed
- Ball count for stage n (0-indexed) = `min(floor((n - 5) / 2) + 3, 8)` —
  caps at 8 balls from stage 16 onward.
- Time budget for stage n (0-indexed) = `STAGE_TIME_SECONDS - n`, floored at
  20 seconds (`getStageTimeSeconds`, `constants.ts`) — added when `STAGE_COUNT`
  grew past 90, since the unfloored formula went to zero/negative and ended
  the run the instant it started for every stage from 91 onward. Originally
  floored at 12s, raised to 20s: with the default single harpoon (~0.6s
  round trip, ~1.5 hits/sec) and up to 8 max-size balls needing up to 56
  total hits to fully clear, 12s only allowed ~18 hits — unwinnable without
  power-ups, which read as running out of time rather than a real challenge.

### Hazard/mechanic-stacking balance pass

A later session added several persistent, non-hazard-scoped mechanics on
top of the existing 10-stage hazard blocks: destructible platforms (stage
21/index 20 on, `isDestructiblePlatform`, `terrain.ts`), moving platforms
(stage 26/index 25 on, `isMovingPlatform`, `terrain.ts`), ladders (stage
31/index 30 on, `getStageLadder`, `terrain.ts`), and the roaming critter
(stage 6/index 5 on, `getStageCritters`, `critters.ts`). Unlike the
per-block hazards in `fireZones.ts`/`acidRain.ts`/etc. (each on for
exactly 10 stages, one at a time), none of these four have an end stage —
so from stage 20 on, every later hazard block automatically stacks with
all four on top of it, and the overlap only gets denser as more hazard
blocks stack in Chaos Rift (stages 151-200). A balance review found two
concrete overtuned intersections and fixed both narrowly, without
touching the per-block hazards themselves or the four mechanics'
established early/mid-game pacing:

- **Destructible + moving platform collision**: the two mechanics were
  gated on different moduli (`(stage + platformIndex) % 3 === 0` and
  `% 4 === 1`) with a comment stating they'd "interleave" onto different
  platforms, but the moduli both land on sums ≡ 9 (mod 12) — about 1 in 12
  platforms was silently both breakable _and_ drifting, a much harder read
  (bounce point shifting _and_ the platform vanishing mid-flight) than
  either alone. `isMovingPlatform` now explicitly excludes platforms
  `isDestructiblePlatform` already claims, restoring the originally
  intended "different platforms" split.
- **Roaming critter density in the hazard-dense back half**: the critter
  recurs forever at a flat 1-in-3-stages cadence with no end stage, so
  from Hell (stage 81/index 80) onward it stacks with every single-block
  environmental hazard (fire zones, low gravity, acid rain, ice wind,
  solar flares, quantum jitter) and, in Chaos Rift, several of them
  replayed at once. `getStageCritters` now thins to 1-in-4 stages from
  index 80 on (`CRITTER_DENSE_HAZARD_STAGE`), cutting one recurring
  cornering risk without touching its stage 6-79 pacing.
- **Critter + icy floor**: Frozen Summit's icy floor (stage 111-120/index
  110-119, `stepPlayerOnTerrain` in `terrain.ts`) makes the player's own
  movement momentum-based instead of snap-to-stop, so reaction distance is
  already worse there than anywhere else. The critter's fastest crawl
  period (2200ms floor, reached by roughly stage 38) unmodified would be
  the single worst overlap in the whole curve — reduced control stacked
  with the fastest unpredictable hazard. The critter's minimum period is
  now floored higher (2800ms) specifically during the icy floor's 10
  stages (`CRITTER_ICY_FLOOR_MIN_PERIOD_MS`), keeping the crawl readable
  while steering is already compromised.

### Full-curve smoothness review (stage 1-200)

A later review checked the whole 1-200 curve end to end, not just the
mechanic-stacking intersections above. One concrete bug found and fixed,
plus judgment-call items flagged but left alone:

- **Chaos Rift well strength sawtooth (fixed)**: `getChaosRiftWells`
  (`chaosRift.ts`) scaled its pull `strength` off `subBlockDepth`, the
  0-9 index that resets every 10 stages (used correctly for cycling
  `WELL_POSITIONS` and for the Prism Collapse spin's onset). Since
  `getChaosRiftCurrent`/`getChaosRiftFireZones` in the same file both
  scale off the full 0-49 Chaos Rift depth instead, this made well
  strength the odd one out: it reset to its 4.4M floor at the start of
  every sub-block (161, 171, 181, 191) instead of compounding across the
  finale, and never exceeded Stellar Forge's own 10.3M cap
  (`gravityWells.ts`, stages 51-60) anywhere in Chaos Rift despite the
  block's own comment claiming to exceed prior well hazards' caps. Now
  uses the full Chaos Rift depth for `strength`/`spin`, matching the
  current/fire-zone pattern — it ranges 4.4M at stage 151 up to 16.85M
  at stage 200, well past every earlier well-based hazard's ceiling.
- **Item drop rate floors by stage 30 (flagged, not changed)**:
  `getStageItemDropChance` (`constants.ts`) hits its 8% floor at stage 30
  and stays flat for the remaining 170 stages, while 12 more escalating
  hazard blocks (Current through Chaos Rift) are introduced after that
  point. Whether power-up support should keep climbing (even slightly)
  alongside hazard density in the back half is a tuning judgment call,
  not a bug — left for discussion.
- **Ball count/speed/platform-count plateaus (flagged, not changed)**:
  ball count caps at 8 by stage 16 (`createStage`, `engine.ts`), speed
  multiplier caps at stage 80, and platform count caps at 4 by stage 16
  (`getTargetPlatformCount`, `terrain.ts`) — all per the original 3-1/3-2
  design intent (later stages differentiate through hazard identity, not
  raw count/speed). Confirmed intentional, not a drift bug, but noting
  it here since it means roughly stages 80-200 (120 stages, well over
  half the game) carry difficulty entirely through hazard-block identity
  and terrain layout rather than any numeric curve — worth knowing if a
  future pass wants a gentler numeric trickle on top.
