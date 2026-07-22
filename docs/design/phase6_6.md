# Phase 6-6. Fully Independent Illustrated Backgrounds (Stages 21-200)

## Goal

- Replace every previously composited background from stage 21 through
  stage 200 with a newly generated, full-frame illustration.
- Treat the stage's display title and chapter theme as the art brief for
  that stage. Every stage must read as its named location or concept at a
  glance.
- Never reuse a chapter plate, Canvas silhouette, crop, pan, hue shift, or
  any other shared source image between stages.

## Runtime behavior

- `stage021.webp` through `stage200.webp` are the complete final frames.
  `backgrounds.ts` draws exactly one dedicated image and does not draw a
  Canvas scene below or above it.
- While an image is decoding, render only a neutral dark gradient. The
  old Canvas function is not used as a visual fallback because that would
  briefly show a different scene.
- Keep the existing async-ready event so gameplay and stage-map previews
  repaint when decoding completes.

## Art direction

- Use one built-in image-generation request per stage. The prompt includes
  the exact stage number, display title, and chapter name.
- Style: polished, hand-painted, family-friendly 16:9 arcade environment.
- Composition: readable open center and lower playfield, with the named
  landmark or concept clearly expressed through unique architecture,
  terrain, lighting, palette, atmosphere, and focal silhouette.
- Exclude characters, creatures, text, numbers, UI, logos, watermarks, and
  borders from every image.
- Adjacent stages must not share the same composition or dominant focal
  object. A unique file hash alone is not sufficient; contact-sheet review
  must show visibly distinct scenes.

## Delivery

- Generate, optimize to 960x540 WebP, visually inspect, commit to
  `master`, push, and verify GitHub Pages in 18 independent ten-stage
  batches: 21-30 through 191-200.
- After the final batch, verify 180 files, 180 unique SHA-256 hashes,
  matching 960x540 dimensions, tests, type-check, lint, production build,
  and the live Pages response.
