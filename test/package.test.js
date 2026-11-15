const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.join(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));

// The store package as `git archive` builds it, from the committed tree plus uncommitted edits to tracked files.
function packageListing() {
  const tree = execFileSync("git", ["stash", "create"], { cwd: root, encoding: "utf8" }).trim() || "HEAD";
  const archive = execFileSync("git", ["archive", "--format=tar", tree], { cwd: root });
  return execFileSync("tar", ["-t"], { input: archive, encoding: "utf8" }).split("\n").filter(Boolean).sort();
}

function filesTheManifestLoads() {
  const popup = manifest.action.default_popup;
  const popupScripts = [...fs.readFileSync(path.join(root, popup), "utf8").matchAll(/<script src="([^"]+)"/g)]
    .map(([, src]) => path.posix.join(path.posix.dirname(popup), src));
  return [
    "manifest.json",
    ...Object.values(manifest.icons),
    ...Object.values(manifest.action.default_icon),
    ...manifest.content_scripts.flatMap((script) => script.js),
    popup,
    ...popupScripts,
  ];
}

test("the store package holds exactly what the browser loads, plus the license", () => {
  const files = new Set([...filesTheManifestLoads(), "LICENSE"]);
  const folders = [...files].filter((file) => file.includes("/")).map((file) => `${path.posix.dirname(file)}/`);
  assert.deepEqual(packageListing(), [...new Set([...files, ...folders])].sort());
});
