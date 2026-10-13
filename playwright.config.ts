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
  // Exercise the built Worker with synthetic local D1 fixtures. Tests must
  // never consume production quotas or depend on records edited in the panel.
  webServer: {
    command: 'node scripts/test-server.mjs',
    url: origin,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
