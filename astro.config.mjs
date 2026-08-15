// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';

// Server output on Workers: the portfolio reads its records from the `oliweb`
// D1 database through the `DB` binding declared in wrangler.jsonc.
export default defineConfig({
  site: 'https://olivermartinezharo.com',
  output: 'server',
  // `remoteBindings` honours the `remote` flag on the D1 binding, so `dev` and
  // `preview` read the real database instead of an empty local one.
  adapter: cloudflare({ remoteBindings: true }),
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
