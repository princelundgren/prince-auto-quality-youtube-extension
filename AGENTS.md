# Auto Quality for YouTube — agent notes

Everything in this repository is public: write nothing personal into it.

- Test: `node --test` (no dependencies, no build step)
- The fix depends on timing: `src/content.js` must run at `document_start` and write
  `yt-player-quality` before YouTube's player starts. Never set quality through the player's
  methods after load; that switch is what restarts the video
- `src/quality.js` is a classic script shared by the content script, the popup and the tests, so
  it can't use `import`/`export`
- The shape of `yt-player-quality` is YouTube's, not ours: change it only after reading the value
  YouTube writes when quality is picked by hand

## Design goals

The goals and their reasons are in `README.md`, "Design goals". What they mean for a change:

- No background service worker, timers (`setInterval`, `setTimeout`, `requestAnimationFrame`),
  `MutationObserver`, polling or network calls in `src/`; `test/design-goals.test.js` enforces
  this and the permissions below
- Permissions stay `storage` alone, on `https://www.youtube.com/*` alone
- No dependencies, bundler or framework; the popup stays one plain HTML control
- A feature that needs any of the above, or adds a second job besides the starting quality, is
  proposed in an issue first, not built
