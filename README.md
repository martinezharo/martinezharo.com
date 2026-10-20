# martinezharo.com ☝🏻👹

Hi! Oli here. This is my site: a portfolio, a stack page, and a services page where you can ask me to build something for you. It speaks English and Spanish.

I needed a place to show what I build, so I built it.

## What's inside

- **Astro** on **Cloudflare Workers**, with the projects read from a D1 database.
- **Projects** with their story, scores and filters, plus the **stack** I like working with.
- **Services** with prices and a contact form (Turnstile + Cloudflare Email).
- Search and agent discovery out of the box: sitemap, `llms.txt`, Markdown pages and social cards.

## Run it

```sh
pnpm install
pnpm dev
```

Local dev reads the real `oliweb` database, read-only, because an empty portfolio isn't worth developing against. Be kind to it.

```sh
pnpm check      # types
pnpm test:e2e   # builds and runs Playwright against local fixtures
pnpm deploy     # build and ship it
```

## More notes

The details live in [`docs/`](docs): [Cloudflare](docs/cloudflare.md), [discovery](docs/discovery.md) and [services](docs/services.md).

Got something in mind? Come say hi at [martinezharo.com/services](https://martinezharo.com/services).
