// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Mockup phase: static output, no data layer yet. The Cloudflare adapter and D1
// binding come back once a direction is picked.
export default defineConfig({
  site: 'https://olivermartinezharo.com',
  integrations: [react()],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
