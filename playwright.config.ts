import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig } from '@playwright/test';

// PREVIEW_PORT moves the run out of the way when something already holds the
// default port.
const port = process.env.PREVIEW_PORT ?? '4399';
const origin = `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: join(tmpdir(), 'olisite-playwright-results'),
  fullyParallel: true,
  reporter: 'line',
  use: {
    baseURL: origin,
    browserName: 'chromium',
    channel: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  // The build is a Worker now, so the tests run against the Workers runtime and
  // the real D1 database rather than a static file server. This is `wrangler
  // dev` on the config the adapter emits rather than `astro preview`, which
  // daemonizes itself and would look like an early exit here.
  webServer: {
    command: `pnpm exec wrangler dev -c dist/server/wrangler.json --port ${port}`,
    url: origin,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
