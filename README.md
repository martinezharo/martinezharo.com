# Olisite

Static Astro portfolio for `olivermartinezharo.com`.

## Commands

- `pnpm dev` starts the local development server.
- `pnpm check` runs Astro and TypeScript diagnostics.
- `pnpm build` creates the static site in `dist/`.
- `pnpm test:e2e` builds the site and runs the Playwright smoke tests.

## Structure

- `src/config/` contains site-wide copy and links.
- `src/data/` contains project records.
- `src/features/projects/` owns the project model, UI, styles, and client behaviour.
- `src/components/` contains page-level sections and shared shell components.
- `src/layouts/` contains complete HTML document layouts.
- `src/styles/` contains global and page-level styles.
- `tests/e2e/` verifies the interactive project controls and responsive shell.

Add or update portfolio entries in `src/data/projects.ts`. Changes to project kinds, scores, sorting, or display rules belong in `src/features/projects/` so the data file stays declarative.
