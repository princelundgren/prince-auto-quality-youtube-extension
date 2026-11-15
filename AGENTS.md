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
