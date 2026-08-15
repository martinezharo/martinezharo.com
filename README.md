# Olisite

Astro portfolio for `olivermartinezharo.com`, server-rendered on Cloudflare
Workers.

## Data

Projects come from the `projects` table of the `oliweb` D1 database, read on
every request through the `DB` binding declared in `wrangler.jsonc`. The
database does not carry the portfolio's type, ratings, hours or stack, so those
live in `src/data/project-presentation.ts`, keyed by slug and joined in
`src/features/projects/repository.ts`. A row with no entry there is left out of
the showcase, with a warning naming the slug.

Local `dev`, `preview` and the end-to-end tests all read the real database: the
binding is marked `remote`, so nothing has to be seeded locally.

## Commands

- `pnpm dev` starts the local development server.
- `pnpm check` regenerates the binding types and runs Astro and TypeScript diagnostics.
- `pnpm build` builds the Worker and its assets into `dist/`.
- `pnpm preview` serves the built Worker locally.
- `pnpm deploy` builds and deploys to Cloudflare.
- `pnpm test:e2e` builds the site and runs the Playwright smoke tests. `PREVIEW_PORT` moves them off the default port.

## Structure

- `src/config/` contains site-wide copy and links.
- `src/data/` contains the presentation records that D1 does not hold.
- `src/features/projects/` owns the project model, UI, styles, and client behaviour.
- `src/components/` contains page-level sections and shared shell components.
- `src/layouts/` contains complete HTML document layouts.
- `src/styles/` contains global and page-level styles.
- `tests/e2e/` verifies the interactive project controls and responsive shell.

Add or update a project in the `oliweb` database, then give it a matching entry
in `src/data/project-presentation.ts`. Changes to project kinds, scores, sorting
or display rules belong in `src/features/projects/` so the data stays
declarative.
