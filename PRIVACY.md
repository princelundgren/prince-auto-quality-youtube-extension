# Privacy

Prince Auto Quality for YouTube™ collects no personal data and sends nothing anywhere.

- **What it stores:** the one quality you pick in its popup, in your browser's extension storage
  (`chrome.storage.sync`). If you turn on your browser's sync, the browser syncs that setting
  between your devices like any other extension setting; the extension itself never sees or sends
  it anywhere.
- **What it changes:** on `www.youtube.com` only, it writes that quality to YouTube's own player
  setting (`yt-player-quality`) in the page's local storage, where YouTube keeps it when you pick a
  quality by hand. With Auto, it removes that setting so YouTube decides.
- **What it never does:** read your browsing history or the pages you visit, use analytics or
  tracking, make network requests, or run on any other site.

Questions:
[open an issue](https://github.com/princelundgren/prince-auto-quality-youtube-extension/issues).
