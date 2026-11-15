const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const sources = fs
  .readdirSync(path.join(root, "src"))
  .filter((name) => name.endsWith(".js"))
  .map((name) => ({ name, code: fs.readFileSync(path.join(root, "src", name), "utf8") }));

test("nothing keeps running after the page starts", () => {
  assert.equal(manifest.background, undefined, "no background service worker");
  const ongoingWork = /\b(setInterval|setTimeout|requestAnimationFrame|MutationObserver)\b/;
  for (const { name, code } of sources) {
    assert.doesNotMatch(code, ongoingWork, `${name} schedules or watches work`);
  }
});

test("it asks for one permission on one site and makes no network requests", () => {
  assert.deepEqual(manifest.permissions, ["storage"]);
  assert.equal(manifest.host_permissions, undefined);
  assert.deepEqual(
    manifest.content_scripts.flatMap((script) => script.matches),
    ["https://www.youtube.com/*"],
  );
  for (const script of manifest.content_scripts) {
    assert.notEqual(script.all_frames, true, "embedded videos on other websites are left alone");
  }
  const network = /\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\b/;
  for (const { name, code } of sources) {
    assert.doesNotMatch(code, network, `${name} makes a network request`);
  }
});
