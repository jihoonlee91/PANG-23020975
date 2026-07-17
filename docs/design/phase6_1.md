# Phase 6-1. Release Notes

## Goal

- The version number has been shown on the main screen since 1.4.0, and
  the game already detects and applies updates automatically, but a
  player who notices the number bump has no way to see what actually
  changed. Give them a lightweight in-game changelog.

## Design

- A static, hand-maintained list of recent releases lives in
  `src/game/releaseNotes.ts`: `{ version, date, notes: string[] }[]`,
  newest first. It is not auto-generated from commit messages — commit
  subjects are written for other developers, release notes are written
  for players, and the two audiences don't always want the same wording
  or level of detail.
- A "What's New" button in Settings opens a new full-screen list (same
  `.screen` treatment as Settings/Tutorial) showing each version's date
  and bullet points, most recent first. "Back" returns to Settings
  (not the main menu — Settings is where it was opened from), matching
  how Esc/the Android back button already have per-screen targets.
- Only the last handful of releases are kept in the list (older entries
  are dropped from the source file) — this is a "what changed recently"
  view, not a permanent public changelog.

## Maintenance

- Add a new entry to `RELEASE_NOTES` whenever `package.json`'s version is
  bumped for player-visible behavior (i.e. the same commits that already
  require a version bump per `CLAUDE.md`) — internal-only changes (chores,
  test-only commits) don't need an entry.

## Files

- `src/game/releaseNotes.ts` — the `RELEASE_NOTES` data + `ReleaseNote`
  type
- `src/components/WhatsNewDialog.tsx` — the screen component
- `src/App.tsx` — `'whatsNew'` screen state, Settings wiring, back-target
  override
- `src/App.css` — list styling, reusing the existing `.screen`/hint-list
  patterns
