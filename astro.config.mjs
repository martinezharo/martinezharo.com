// @ts-check
import { defineConfig } from 'astro/config';

// Static output. Project data still lives in src/data; the Cloudflare adapter
// and the D1 binding come back when it moves out of the repository.
export default defineConfig({
  site: 'https://olivermartinezharo.com',
  devToolbar: { enabled: false },
  vite: {
    css: {
      // Lightning CSS is here for @custom-media: the breakpoint is declared
      // once in src/styles/breakpoints.css instead of in every stylesheet.
      transformer: 'lightningcss',
      // No targets: like the esbuild minifier it replaces, this only minifies
      // and leaves the hand-written prefixes and modern syntax alone.
      lightningcss: { drafts: { customMedia: true } },
    },
  },
});
