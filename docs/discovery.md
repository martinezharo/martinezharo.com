# Search and agent discovery

The canonical origin is `site` in `astro.config.mjs`. English pages use unprefixed URLs; Spanish pages use `/es`. The layout publishes canonical URLs, reciprocal language alternatives, a Markdown alternative, the sitemap, and `/llms.txt`.

- `/robots.txt` is generated at build time, allows public crawlers, and advertises `/sitemap.xml`.
- `/sitemap.xml` lists the home page, stack, hire page, and every renderable project in both languages. It uses the same repository filtering as the portfolio. There is no reliable content-update timestamp, so it omits `lastmod`.
- `/llms.txt` is a concise index of the profile, stack, hire, and project Markdown pages in both languages.
- `/index.md`, `/stack.md`, `/hire.md`, and `/projects/{slug}.md` have Spanish counterparts under `/es`. They reuse the public copy, tools, and project records, including translation fallback. Missing or incomplete projects return 404.
- HTML includes JSON-LD for the person, website, page, and (on project pages) the creative work. Portfolio scores are not marked up as customer ratings. JSON is escaped for safe embedding in HTML.
- Every HTML page declares `/favicon.png` (96 × 96) and `/favicon.ico` (16, 32, 48 and 96 pixels) without media conditions. These raster assets reproduce `public/icon.svg` on an opaque black background so the mark stays visible on either search theme. The theme-specific SVG icons remain available for browser tabs. If the mark changes, regenerate both raster files and keep their URLs stable.

Dynamic discovery responses use the Workers Cache API, with one hour at the edge and five minutes in browsers. Keys ignore query strings and are isolated by request origin and path. Only successful GET bodies are stored; HEAD requests cannot replace a cached body. A cold sitemap, agent index, or profile costs one existing project-list query; a project Markdown page costs one slug lookup. Cache is local to each Cloudflare data center and does not impose a hard database spending cap. Database edits may take up to an hour to appear in discovery documents; HTML keeps its existing one-minute caching policy.

## Validation

Run `pnpm check` and `pnpm test:e2e`. The E2E server derives an ignored config from the built Worker, disables remote D1, and seeds only local synthetic fixtures. No production records or migrations are touched.

After deployment, verify `/robots.txt`, `/sitemap.xml`, `/llms.txt`, a Markdown project in each language, and HTML metadata. Submit the sitemap in Google Search Console and use URL Inspection for representative English and Spanish pages. Search Console access and real Core Web Vitals measurements are external follow-up tasks; these files do not guarantee indexing, ranking, or AI citations.

For favicon changes, verify both raster URLs return HTTP 200 with an image content type and request indexing of the canonical home page in Search Console. [Google's favicon guidelines](https://developers.google.com/search/docs/appearance/favicon-in-search) require a crawlable square icon in a supported format; SVG is not listed. Google may take several days to several weeks to recrawl and process the icon, and display is not guaranteed.

Open Graph and Twitter Cards are intentionally outside this change.
