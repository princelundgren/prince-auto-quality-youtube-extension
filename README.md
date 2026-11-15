# Auto Quality for YouTube

[![Test](https://github.com/princelundgren/prince-auto-quality-youtube-extension/actions/workflows/test.yml/badge.svg)](https://github.com/princelundgren/prince-auto-quality-youtube-extension/actions/workflows/test.yml)

A small Chromium extension that starts every YouTube video at the quality you choose.

Most auto-quality extensions wait for the player to load and then switch quality, so the video
starts at a lower quality and jumps, or restarts, a moment later. This one writes your choice to
the setting YouTube's player reads when it starts (`yt-player-quality` in the page's
localStorage), before the player loads. The video starts at that quality, with nothing to switch.

- One setting, picked from the toolbar button: 360p to 4320p (8K), or Auto
- A few dozen lines of code and one permission (`storage`); no timers, page observers or polling
- No network requests, no tracking

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
