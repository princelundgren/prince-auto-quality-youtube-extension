# Auto Quality for YouTube

[![Test](https://github.com/princelundgren/prince-auto-quality-youtube-extension/actions/workflows/test.yml/badge.svg)](https://github.com/princelundgren/prince-auto-quality-youtube-extension/actions/workflows/test.yml)

A small Chromium extension that starts every video on youtube.com at the quality you choose.
`youtube.com`, `youtu.be` and, on a desktop browser, `m.youtube.com` links all redirect there.
It leaves videos embedded in other websites alone on purpose, and YouTube Music is not covered.

Most auto-quality extensions wait for the player to load and then switch quality, so the video
starts at a lower quality and jumps, or restarts, a moment later. This one writes your choice to
the setting YouTube's player reads when it starts (`yt-player-quality` in the page's
localStorage), before the player loads. The video starts at that quality, with nothing to switch.

## Design goals

1. **Does one thing.** It sets the quality a video starts at. Other YouTube tweaks belong in other
   extensions, so this one stays small enough to read in a few minutes.
2. **Costs nothing while you watch.** It writes one value as the page starts and then stops: no
   background worker, no timers, no polling, no watching the page. The video gets the CPU and
   memory, not the extension.
3. **Never gets in the way of playback.** It changes nothing once a video is playing. If YouTube
   stops reading the setting, videos still play normally at YouTube's own choice of quality.
4. **Asks for as little as possible.** One permission (`storage`), one site (`www.youtube.com`),
   no network requests, no tracking, no dependencies.
5. **A UI you can use in one click.** One menu in the toolbar popup, plain HTML that follows your
   light or dark theme, no settings page.

The tests check what a script can see of goals 2 and 4 (no background worker, timers, page
observers or network calls; one permission on one site), so a change that breaks them fails CI.

## Install

It isn't in the Chrome Web Store yet. To load it unpacked in Chrome, Brave, Edge or another
Chromium browser:

1. Clone or download this repository
2. Open `chrome://extensions` (`brave://extensions` in Brave) and turn on **Developer mode**
3. Click **Load unpacked** and choose the repository folder
4. Click the extension's toolbar button and pick a quality

A change applies to the next video you open. Turn off other extensions that set YouTube's quality,
or they will switch it again after playback starts.

## Known limits

- `yt-player-quality` is not a public YouTube API, so a YouTube update can change or ignore it
- Picking a quality by hand in the player still works; the extension sets it again on the next
  page load

## Development

```sh
node --test
```

The tests need Node 22 or newer and no dependencies. Reload the extension in `chrome://extensions`
after changing a file.

Issues and pull requests are welcome.

## License

[MIT](LICENSE)
