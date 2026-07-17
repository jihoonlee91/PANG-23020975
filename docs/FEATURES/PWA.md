# PWA and offline behavior

`manifest.webmanifest` configures standalone landscape launch under the GitHub Pages base path. The service worker uses a network-first strategy and caches the application shell and successfully fetched runtime assets.

The service worker is registered only in production. Deploy smoke tests should confirm `index.html`, the JavaScript/CSS bundles, manifest, icon, and `sw.js` are all served below `/orbit/`.

## Manual install button

Chromium browsers only show their automatic "install app" banner once an
engagement heuristic is met (repeat visits, time on site), and Safari on iOS
never shows one at all — a player can easily never see it. To give a
reliable install path, `App.tsx` listens for the `beforeinstallprompt`
event, stops it from auto-firing (`event.preventDefault()`), and stashes it.
The Settings screen shows an "Install App" button whenever that stashed
event is available; tapping it replays the browser's own native prompt
(`event.prompt()`).

- If the app is already running standalone (`display-mode: standalone` or
  iOS's `navigator.standalone`), no install UI is shown.
- On iOS Safari, where `beforeinstallprompt` never fires, Settings shows a
  static hint instead ("Share → Add to Home Screen") so there's still a
  clear next step.
- On other browsers that don't support the event and aren't iOS (e.g.
  Firefox), no install UI is shown — there's no programmatic path to offer.
