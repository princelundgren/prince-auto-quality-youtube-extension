// Shared by the content script, the popup and the tests, so it is a classic script, not a module.

const PLAYER_QUALITY_KEY = "yt-player-quality";
const SAVED_QUALITY_LIFETIME_MS = 360 * 24 * 60 * 60 * 1000;
const DEFAULT_QUALITY = 1080;
const QUALITY_OPTIONS = [
  { value: "auto", label: "Auto (YouTube decides)" },
  { value: 4320, label: "4320p (8K)" },
  { value: 2880, label: "2880p (5K)" },
  { value: 2160, label: "2160p (4K)" },
  { value: 1440, label: "1440p" },
  { value: 1080, label: "1080p" },
  { value: 720, label: "720p" },
  { value: 480, label: "480p" },
  { value: 360, label: "360p" },
];

/**
 * Builds the value YouTube's player stores under `yt-player-quality` when you pick a quality by
 * hand. The player reads it when it starts, so writing it before then makes the video start at
 * that quality instead of switching later.
 *
 * @param {number} height Video height in pixels, such as 1440.
 * @param {number} now Milliseconds since the epoch, as from `Date.now()`.
 * @returns {string} The JSON string to store in `localStorage`.
 */
function savedQualityEntry(height, now) {
  return JSON.stringify({
    data: JSON.stringify({ quality: height, previousQuality: height }),
    expiration: now + SAVED_QUALITY_LIFETIME_MS,
    creation: now,
  });
}

/**
 * Returns the stored setting when it is one of the options, or the default otherwise, so a
 * cleared, hand-edited or future value never reaches YouTube's player.
 *
 * @param {unknown} stored The `quality` value read from `chrome.storage.sync`.
 * @returns {number | "auto"} A value from `QUALITY_OPTIONS`.
 */
function validQuality(stored) {
  return QUALITY_OPTIONS.some((option) => option.value === stored) ? stored : DEFAULT_QUALITY;
}

if (typeof module !== "undefined") {
  module.exports = {
    PLAYER_QUALITY_KEY,
    DEFAULT_QUALITY,
    QUALITY_OPTIONS,
    savedQualityEntry,
    validQuality,
  };
}
