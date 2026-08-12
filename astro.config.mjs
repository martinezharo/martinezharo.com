// @ts-check
import { defineConfig } from 'astro/config';

// Static output. Project data still lives in src/data; the Cloudflare adapter
// and the D1 binding come back when it moves out of the repository.
export default defineConfig({
  site: 'https://olivermartinezharo.com',
  devToolbar: { enabled: false },
});
