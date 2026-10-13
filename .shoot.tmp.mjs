import { chromium } from '@playwright/test';
const base = process.argv[2];
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_BROWSERS_PATH + '/chromium-1248/chrome-linux64/chrome' });
for (const v of ['configurador', 'tallas', 'cartel']) {
  for (const [tag, w, h] of [['desk', 1440, 900], ['mob', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(`${base}/es/hire/${v}`);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `/tmp/hire-shots/${v}-${tag}.png`, fullPage: true });
    await page.close();
  }
}
await browser.close();
