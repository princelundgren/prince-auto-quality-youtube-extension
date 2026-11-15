const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { savedQualityEntry, QUALITY_OPTIONS, DEFAULT_QUALITY } = require("../src/quality.js");

const DAY_MS = 24 * 60 * 60 * 1000;

// The shape YouTube's own player writes after a quality is picked, read from a browser's localStorage:
// {"data":"{\"quality\":1080,\"previousQuality\":1080}","expiration":<creation + 360 days>,"creation":<ms>}
test("savedQualityEntry matches the value YouTube's player stores", () => {
  const now = 1_794_749_198_143;
  const entry = JSON.parse(savedQualityEntry(1440, now));

  assert.deepEqual(JSON.parse(entry.data), { quality: 1440, previousQuality: 1440 });
  assert.equal(entry.creation, now);
  assert.equal(entry.expiration, now + 360 * DAY_MS);
});

test("the default quality is one of the options", () => {
  assert.ok(QUALITY_OPTIONS.some((option) => option.value === DEFAULT_QUALITY));
});

test("the content script runs at document_start, after the shared quality.js", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf8"));
  const [script] = manifest.content_scripts;

  assert.equal(script.run_at, "document_start");
  assert.deepEqual(script.js, ["src/quality.js", "src/content.js"]);
});
