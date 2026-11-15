// Renders the icons and the store images from their sources with Playwright's Chromium.
// Run from the repository root: npm install --no-save playwright && npx playwright install chromium && node scripts/render-images.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const svg = fs.readFileSync(path.join(root, "icons/icon.svg"), "utf8");
const browser = await chromium.launch();

// Chrome's store icon is 96 px of artwork inside 16 px of transparent padding; the toolbar sizes fill.
const icons = await browser.newPage();
for (const [size, padding] of [[16, 0], [32, 0], [48, 0], [128, 16]]) {
  const art = size - 2 * padding;
  await icons.setViewportSize({ width: size, height: size });
  await icons.setContent(
    `<body style="margin:0"><div style="padding:${padding}px;line-height:0">${svg.replace("<svg ", `<svg width="${art}" height="${art}" `)}</div></body>`,
  );
  await icons.screenshot({ path: path.join(root, `icons/icon-${size}.png`), omitBackground: true });
}

// The screenshot shows the real popup, with a stand-in for chrome.storage holding 4K.
const store = await browser.newPage({ colorScheme: "light" });
await store.addInitScript(() => {
  window.chrome = Object.assign(window.chrome ?? {}, {
    storage: {
      sync: { get: async (defaults) => ({ ...defaults, quality: 2160 }), set: async () => {} },
      onChanged: { addListener: () => {} },
    },
  });
});
for (const [name, width, height] of [["screenshot", 1280, 800], ["promo-small", 440, 280]]) {
  await store.setViewportSize({ width, height });
  await store.goto(`file://${path.join(root, `store/${name}.html`)}`);
  await store.waitForLoadState("networkidle");
  await store.screenshot({ path: path.join(root, `store/${name}.png`) });
}

await browser.close();
