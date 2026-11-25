/* ~2 min mobile walkthrough for Better Typography (calm default). Requires:
   - google-chrome with remote debugging
   - playwright-core
   - HTTP server at repo root: python3 -m http.server 8766
*/
import { chromium } from "playwright-core";
import { spawn } from "child_process";

const BASE = "http://127.0.0.1:8766/redesign-options/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const t0 = Date.now();
const log = (m) => console.log(`${((Date.now() - t0) / 1000).toFixed(1)}s ${m}`);

spawn(
  "google-chrome",
  [
    "--remote-debugging-port=9333",
    "--user-data-dir=/tmp/chrome-better-type",
    "--no-first-run",
    "--no-default-browser-check",
    "--app=" + BASE + "index.html",
    "--window-size=390,844",
    "--window-position=700,80",
    "--force-device-scale-factor=1",
  ],
  { detached: true, stdio: "ignore" }
).unref();

await sleep(3500);
const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
const page = browser.contexts()[0].pages()[0];
const cdp = await browser.contexts()[0].newCDPSession(page);
await cdp.send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 0,
  mobile: true,
});
await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

async function smooth(dy, ms) {
  await page.evaluate(
    ([dy, ms]) =>
      new Promise((res) => {
        const s = scrollY;
        const t0 = performance.now();
        const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
        (function f(now) {
          const k = Math.min(1, (now - t0) / ms);
          scrollTo(0, s + dy * ease(k));
          k < 1 ? requestAnimationFrame(f) : res();
        })(t0);
      }),
    [dy, ms]
  );
}

async function tap(loc) {
  const bb = await loc.boundingBox();
  if (!bb) return;
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
}

await page.evaluate(() => localStorage.removeItem("uk-ru-typography"));
await page.goto(BASE + "index.html");
await page.waitForSelector("#type-lab");
await sleep(2000);
log("Calm default on index");

await sleep(5000);
await smooth(700, 5500);
await sleep(2000);
await smooth(600, 5000);
await sleep(2000);
log("compare: Current");

await tap(page.locator('[data-type-ab="default"]'));
await sleep(5000);
await smooth(-400, 3000);
await sleep(2000);
await smooth(500, 4500);
await sleep(2000);

await tap(page.locator('[data-type-ab="calm"]'));
await sleep(4000);
log("Dispatch (Calm)");

await page.locator('a[href*="option-a-dispatch"]').first().scrollIntoViewIfNeeded();
await sleep(800);
await Promise.all([page.waitForNavigation({ waitUntil: "load" }), tap(page.locator('a[href*="option-a-dispatch"]').first())]);
await sleep(2500);
await smooth(550, 5000);
await sleep(2000);
await smooth(650, 5500);
await sleep(2000);
await smooth(500, 4500);
await sleep(2000);

await tap(page.locator('[data-type-ab="default"]'));
await sleep(4000);
await smooth(-350, 3500);
await sleep(2000);

await tap(page.locator('[data-type-ab="calm"]'));
await sleep(3000);
log("Desk (Calm)");

await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await sleep(1000);
const opt = page.locator('footer a[href="./index.html"]').last();
await opt.scrollIntoViewIfNeeded();
await sleep(500);
await Promise.all([page.waitForNavigation({ waitUntil: "load" }), tap(opt)]);
await sleep(1500);
await page.locator('a[href*="option-d-desk"]').first().scrollIntoViewIfNeeded();
await sleep(500);
await Promise.all([page.waitForNavigation({ waitUntil: "load" }), tap(page.locator('a[href*="option-d-desk"]').first())]);
await sleep(2000);
await smooth(450, 4000);
await sleep(2000);

await page.goBack({ waitUntil: "commit" });
await page.waitForSelector("#type-lab", { timeout: 15000 });
await sleep(1500);
await smooth(-800, 2000);
await sleep(5000);
log("done");

await browser.close();
process.exit(0);