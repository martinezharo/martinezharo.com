import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: join(tmpdir(), 'olisite-playwright-results'),
  fullyParallel: true,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:4399',
    browserName: 'chromium',
    channel: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node tests/e2e/serve-dist.mjs',
    url: 'http://127.0.0.1:4399',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
