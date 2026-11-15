# Chrome Web Store listing

The text to paste into the Developer Dashboard. The name and summary come from `manifest.json`.

## Store listing

**Description**

Starts every YouTube™ video, Shorts included, at the quality you choose: 4K, 1440p, 1080p or any other, or Auto to let YouTube decide.

How it differs from other auto-quality extensions:
• No switch, no restart. An extension that sets quality through YouTube's player has to wait for it to load, so the video starts low and then switches, which can jump it back to 0:00. This one writes your choice where the player reads it before it starts, so the video starts at your quality.
• Nothing runs while you watch: no background worker, timers or page watching.
• Small enough to read in a few minutes: a few files of plain JavaScript, no dependencies.
• One permission (storage) on www.youtube.com only. No tracking, no network requests.

It leaves YouTube Music and videos embedded on other websites alone.

Open source (MIT): https://github.com/princelundgren/prince-auto-quality-youtube-extension

YouTube is a trademark of Google LLC. Use of this trademark is subject to Google Permissions. This extension is not made, endorsed or sponsored by Google or YouTube.

**Images:** icon from the package (`icons/icon-128.png`), screenshot `store/screenshot.png`, small
promo tile `store/promo-small.png`.

**Homepage URL:** https://github.com/princelundgren/prince-auto-quality-youtube-extension
**Support URL:** https://github.com/princelundgren/prince-auto-quality-youtube-extension/issues

## Privacy practices

**Single purpose:** Starts YouTube videos at the playback quality the user picks.

**Permission justification, `storage`:** Saves the one quality the user picks in the popup so the
content script can apply it on every YouTube page.

**Host permission justification, `https://www.youtube.com/*`:** The content script writes the chosen
quality to YouTube's own player setting in the page's localStorage before the player starts. It runs
on www.youtube.com only, in the top frame.

**Remote code:** No, I am not using remote code.

**Data usage:** collects none of the listed data types; tick all three certifications.

**Privacy policy URL:**
https://github.com/princelundgren/prince-auto-quality-youtube-extension/blob/main/PRIVACY.md
