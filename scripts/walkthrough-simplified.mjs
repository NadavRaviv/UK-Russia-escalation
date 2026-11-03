import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = "http://127.0.0.1:8765";
const outDir = "/opt/cursor/artifacts";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: outDir, size: { width: 1280, height: 800 } },
});
const page = await context.newPage();

async function pause(ms) {
  await page.waitForTimeout(ms);
}

async function visit(url, scroll = 0) {
  await page.goto(url, { waitUntil: "networkidle" });
  await pause(1200);
  if (scroll) await page.evaluate((y) => window.scrollBy(0, y), scroll);
  await pause(2200);
}

await visit(`${base}/index.html`);
await visit(`${base}/uk-russia-merged-timeline.html#view=outline`, 400);
await visit(`${base}/uk-russia-merged-timeline.html#view=danger`);
await visit(`${base}/uk-russia-plot.html`, 300);
await visit(`${base}/index.html`);

const webm = path.join(outDir, "uk-russia-simplified-walkthrough.webm");
const video = page.video();
await page.close();
if (video) await video.saveAs(webm);
await context.close();
await browser.close();
console.log(webm);
