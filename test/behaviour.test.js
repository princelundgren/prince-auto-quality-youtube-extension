const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const read = (file) => fs.readFileSync(path.join(__dirname, "..", "src", file), "utf8");

// Runs the scripts as the browser does: classic scripts sharing one global scope.
function load(files, globals) {
  const context = vm.createContext({ ...globals, Date });
  for (const file of files) vm.runInContext(read(file), context, { filename: file });
  return context;
}

function fakeChrome(stored) {
  const listeners = [];
  const saved = [];
  return {
    saved,
    fireChange: (changes, area) => listeners.forEach((listener) => listener(changes, area)),
    api: {
      storage: {
        sync: {
          get: async (defaults) => ({ ...defaults, ...stored }),
          set: async (items) => saved.push(items),
        },
        onChanged: { addListener: (listener) => listeners.push(listener) },
      },
    },
  };
}

function fakeLocalStorage() {
  const items = new Map();
  return {
    items,
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
  };
}

async function runContentScript(stored) {
  const chrome = fakeChrome(stored);
  const localStorage = fakeLocalStorage();
  localStorage.setItem("yt-player-quality", "left by YouTube");
  load(["quality.js", "content.js"], { chrome: chrome.api, localStorage });
  await new Promise(setImmediate);
  const savedQuality = () => {
    const entry = localStorage.getItem("yt-player-quality");
    return entry === null ? null : JSON.parse(JSON.parse(entry).data).quality;
  };
  return { chrome, savedQuality };
}

test("a chosen quality is written for the player to start at", async () => {
  const { savedQuality } = await runContentScript({ quality: 1440 });
  assert.equal(savedQuality(), 1440);
});

test("Auto removes the saved quality so YouTube decides", async () => {
  const { savedQuality } = await runContentScript({ quality: "auto" });
  assert.equal(savedQuality(), null);
});

test("a stored value that is not an option falls back to the default", async () => {
  for (const quality of [undefined, "1080", 9999, null]) {
    const { savedQuality } = await runContentScript({ quality });
    assert.equal(savedQuality(), 1080, `stored ${JSON.stringify(quality)}`);
  }
});

test("a change in the popup applies at once, and other storage areas are ignored", async () => {
  const { chrome, savedQuality } = await runContentScript({ quality: 1080 });
  chrome.fireChange({ quality: { newValue: 720 } }, "local");
  assert.equal(savedQuality(), 1080);
  chrome.fireChange({ quality: { newValue: 720 } }, "sync");
  assert.equal(savedQuality(), 720);
  chrome.fireChange({ quality: { oldValue: 720 } }, "sync");
  assert.equal(savedQuality(), 1080, "a cleared setting falls back to the default");
});

test("the popup shows the stored quality and saves a choice as a number", async () => {
  const chrome = fakeChrome({ quality: 2160 });
  const select = {
    options: [],
    value: "",
    add(option) { this.options.push(option); },
    addEventListener(type, listener) { this.onchange = listener; },
  };
  const document = { getElementById: () => select };
  const Option = function (label, value) { return { label, value }; };
  load(["quality.js", "popup.js"], { chrome: chrome.api, document, Option });
  await new Promise(setImmediate);
  assert.equal(select.value, "2160");

  select.value = "1440";
  select.onchange();
  select.value = "auto";
  select.onchange();
  const saved = JSON.stringify(chrome.saved);
  assert.equal(saved, JSON.stringify([{ quality: 1440 }, { quality: "auto" }]));
});
