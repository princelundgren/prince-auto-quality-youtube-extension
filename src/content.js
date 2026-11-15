// The page's localStorage is shared with this isolated-world script, so no page-context script is needed.

function applyQuality(quality) {
  if (quality === "auto") {
    localStorage.removeItem(PLAYER_QUALITY_KEY);
  } else {
    localStorage.setItem(PLAYER_QUALITY_KEY, savedQualityEntry(quality, Date.now()));
  }
}

chrome.storage.sync.get({ quality: DEFAULT_QUALITY }).then(({ quality }) => applyQuality(quality));

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.quality) applyQuality(changes.quality.newValue);
});
