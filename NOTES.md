# olisite

Personal site for Oliver Martínez Haro. A single page: a fixed profile sidebar
and a project index that opens up on hover. The work is the main content;
availability and contact are deliberately secondary.

## How it is built

- **Astro**, static output, no UI framework. The only client-side code is
  `src/scripts/project-controls.ts`.
- **Geist Variable**, self-hosted with Fontsource.
- The project list is rendered on the server. The controls only reorder and hide
  rows that are already in the document, so every project is still listed
  without JavaScript.

## The project list

- **Ratings.** Craft, depth, utility and impact, each shown as one to five
  stars. Scores are stored out of 100 in `src/data/projects.ts` and rounded for
  display; the raw numbers and hours stay hidden.
- **Filter and order.** All / Active, and eight orders: newest, oldest, A–Z,
  overall and each of the four ratings.
- **Status.** Each row leads with a dot and Active / Archived.
- Projects link to the live site when a URL exists.

## Decisions

- All visible copy is in English.
- The layout has a dedicated mobile version and respects reduced-motion
  preferences.

## Still needed for production

- Confirm the final biography and contact address.
- Replace any project logos that only exist as low-resolution raster files.
- Add project detail pages if the site should tell the longer story behind each
  project.
- Move project data to D1 and bring back the Cloudflare adapter.
