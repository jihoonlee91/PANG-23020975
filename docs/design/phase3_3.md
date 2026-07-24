# Phase 3-3. Layout Patterns

> This is a draft. Details will be finalized after discussion.

## Goal

- Design various ball layout patterns to encourage strategic play

## Design

- Stage-starting balls begin at x positions evenly distributed across the screen width
- Adjacent balls are arranged with horizontal velocities in opposite directions so they don't overlap early on
- A platform-style obstacle is placed fixed at the center height of the screen: balls bounce off its top/bottom faces, and harpoons are blocked and despawn on it (referencing the obstacle element from the original Pang)
- Each stage uses a background themed around a different world landmark, all 10 unique (no repeats). Stages 1-5 reference the original Pang's actual stage order (Mt. Fuji -> Guilin -> Emerald Temple -> Angkor Wat -> Ayers Rock...); stages 6-10 continue the world tour with 5 more landmarks also drawn from the original game's later stages: Stage 1 Mt. Fuji (Japan), Stage 2 Guilin (China), Stage 3 Emerald Temple (Thailand), Stage 4 Angkor Wat (Cambodia), Stage 5 Ayers Rock (Australia), Stage 6 Taj Mahal (India), Stage 7 Pyramids of Giza (Egypt), Stage 8 Eiffel Tower (Paris, France), Stage 9 Big Ben (London, UK), Stage 10 Red Square (Moscow, Russia)

## Illustrated background upgrade

- Stages 11-20 use dedicated WebP illustrations, while stages 21-150 combine their existing distinct Canvas compositions with optimized chapter art plates. See `phase6_4.md` for the shared loading, fallback, variation, and performance design.
- Extra floating platform layouts, stages ~5-20: `EXTRA_PLATFORMS` (`terrain.ts`) is a hand-placed array indexed directly by stage. Stages 21-100: `LAYOUT_FAMILIES`, eight distinct hand-shaped patterns (staggered stairs, twin towers, outer rim, zigzag, layered shelves, diamond, scattered cluster, cross), cycled by stage index with per-stage jitter within each family — replaces a single repeating procedural formula that had been reused unchanged across all 80 stages past the hand-placed range.

## Unified background assets

- Every stage from 1 through 201 has one dedicated illustrated `960x540` WebP background matching the gameplay Canvas coordinate space.
- All stage backgrounds live together under `src/assets/backgrounds/stages/`.
- Asset filenames use a zero-padded stage number (`stage001.webp` through `stage201.webp`) so completeness and ordering can be checked mechanically.
- Stages 1-10 use bespoke high-detail landmark illustrations matching the visual treatment of stages 11-20; exported screenshots of procedural Canvas backgrounds do not qualify as illustrated assets.
- The existing Canvas 2D landmark functions for stages 1-10 remain separate as lightweight procedural fallbacks and unrevealed-stage placeholders.
- The gameplay readability grade is baked consistently into every exported image, so the runtime must not apply the grade twice.
