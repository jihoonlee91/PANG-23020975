# Phase 1-6. Attract/AI Mode

## Goal

- A "Watch AI Play" option on the main screen that runs an AI-controlled playthrough with real stakes (it takes damage and can lose a run like a real player), with an on-screen indicator of which inputs the AI is "pressing"

## Design

- Main screen gets a second button, "Watch AI Play", alongside "Start". Clicking it goes straight into gameplay (skipping the countdown) with `demo` mode active
- In AI mode:
  - The AI has full knowledge of the game's physics: for each ball, it forward-simulates the exact same `stepBall` physics function used by real gameplay (not an approximation) to find the ball's next low point — the x position it will be at when it's closest to the player's row — and picks the ball whose low point arrives soonest as its shooting target. This is why it looks like it "knows" the trajectories rather than reactively chasing balls (`predictLandingSpot` in `src/game/engine.ts`)
    - The same per-ball predictions double as a danger map, but the ball currently being shot at is left out of it entirely — that ball isn't a hazard to route around, it's the plan, and treating it as one made the AI stall out short of ever actually firing (a time-margin "bail once it's too close" cutoff was tried and reverted for exactly this reason: it aborted shots that were one frame from landing). Every _other_ ball still goes into `chooseSafeX` (`src/game/engine.ts`), which treats a threat as relevant only if the AI could actually be standing there when it resolves (reachable in time at its current speed, and not already past), searches outward from the desired position for the nearest fully-clear spot, and overrides everything for an immediate reflex escape if something is about to land on its _current_ spot right now. This is genuine reactive avoidance for everything except the active target, not scripted invulnerability
    - While Clock or Hourglass is active, the forward simulation is scaled to match (frozen or slowed) so the AI's own predictions don't drift out of sync with what's actually happening on screen. While Invincible is active, danger-avoidance is skipped entirely — nothing can hurt it, so it beelines for whatever it wants
    - Actively seeks any falling power-up item on screen (items fall straight down, so no prediction needed beyond their current x), prioritizing item pickup over ball-popping — but still routed through the same danger-avoidance as a ball target, since grabbing an item is no longer risk-free
    - Fires only when roughly aligned with the ball target, settled (not mid-dodge), and a harpoon slot is actually free (so the on-screen SPACE indicator doesn't flash as if firing when no shot would actually happen)
  - The player takes real damage on contact, gets the same post-hit invulnerability window as normal play, and can lose all 3 HP and trigger a real game over — the run is a genuine (if AI-piloted) playthrough, not a scripted flawless clear
  - When a stage clears, it loops to the next stage; after the last stage, it loops back to stage 1. A game over also loops back to stage 1, so the attract loop keeps running indefinitely either way until the player exits. Dying on stage 1 itself needs a dedicated fix: `setStageIndex(0)` alone is a no-op there (the index was already 0, so React skips the update and `GamePlay` never re-resets), which used to freeze the loop permanently on that one death. `App.tsx` now also bumps a `demoRunId` counter on every demo game over and keys `<GamePlay>` on it, forcing a real remount regardless of whether the stage index numerically changed
  - AI runs are never recorded to the local score history (`phase4_2.md`) — it isn't a real play session
  - A small on-screen "AI" badge is shown, plus a row of key indicators (←, →, Space) that light up in sync with whatever the AI is currently "pressing", so viewers can see the input driving the play
  - An "Exit AI Mode" control returns to the main screen at any time

### Pro-level upgrade (intercept-verified play)

A second pass raised the AI from "competent" to near-optimal, replacing
its three loosest heuristics with exact simulation and adding real time
pressure:

- **Intercept-verified firing** (`predictHarpoonHit`, `src/game/engine.ts`):
  instead of firing when "roughly aligned and settled" (±18px of the
  target's current x — which whiffs against fast high balls that drift
  out of the wire's path while it climbs), the AI simulates an actual
  harpoon fired from its current x _this frame_: the wire's tip climbs at
  the real `HARPOON_SPEED` while every ball advances with the real
  `stepBall` physics (wind, wells, gravity scale, clock/hourglass time
  scale all included), using the same `harpoonHitsBall` segment test as
  live collision, and aborting if the tip would die on an obstacle first.
  The AI fires the moment any ball's sim reports a hit — mid-stride,
  no settling required, against **any** ball (not just its chosen
  target), so it snipes targets of opportunity while repositioning.
  A cheap horizontal prefilter (`|ball.x − fireX|` vs. how far the ball
  could possibly travel during the wire's climb) keeps the per-frame sim
  cost negligible. While Power Wire is active the wire is an instant
  full-height line, so the check degenerates to "does any ball overlap
  the line right now."
- **Catchable-only item chasing** (`itemCatchSeconds`,
  `src/game/engine.ts`): items fall with `ITEM_GRAVITY` and despawn past
  the floor, so an item is only worth a detour if the AI can physically
  reach its x before it drops past the player row — closed-form fall
  time vs. travel distance at the current (flare-slowed, boost-raised)
  player speed. Uncatchable items are ignored entirely instead of being
  chased across the map, and among catchable ones the soonest-landing is
  taken first.
- **Sticky targeting by real cost**: the shooting target is now the ball
  minimizing `max(arrival time, travel time)` — a ball landing soon but
  across the map no longer beats a nearby one — and the current target is
  kept unless a challenger beats it by a clear margin (0.15s), killing
  the frame-to-frame target thrash the old pure-soonest rule produced.
- **Real time limit** (`countRemainingPops`, `src/game/engine.ts`): the
  stage timer previously didn't tick at all in demo mode. It now runs
  exactly as in normal play (time-up = real game over, restarting the
  attract loop), and the AI paces itself against it: when the remaining
  time budget per remaining pop (every ball counts as `2^(level+1)−1`
  eventual pops) drops below ~0.9s, it stops detouring for items —
  except Time+, which directly buys the budget back — and just keeps
  firing.
- **Rift-aware dodge margins**: on Quantum Rift stages, balls phase-jump
  to new velocities mid-flight, so every forward prediction is only as
  good as the last frame — the AI widens its per-ball dodge radius by an
  extra buffer there (on top of re-planning every frame) to absorb the
  jump distance a prediction can't see coming.
- The settle deadzone tightened from 10px to 6px — snappier final
  alignment with no visible oscillation, since the fire decision no
  longer depends on being settled anyway.
