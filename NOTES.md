# olisite

Personal site for Oliver Martínez Haro. A single page: a fixed profile sidebar
and a project index that opens up on hover. The work is the main content;
availability and contact are deliberately secondary.

## How it is built

- **Astro**, static output, no UI framework. The only client-side code is
  `src/scripts/project-controls.ts` (the state of the list) and
  `src/scripts/project-facets.ts` (the menu that sets it).
- **Geist Variable**, self-hosted with Fontsource.
- The project list is rendered on the server. The controls only reorder and hide
  rows that are already in the document, so every project is still listed
  without JavaScript.

## The project list

- **Ratings.** Craft, depth, utility and impact, each shown as one to five
  stars. Scores are stored out of 100 in `src/data/projects.ts` and rounded for
  display; the raw numbers and hours stay hidden.
- **Filter and order.** One 28px button beside the count, and nothing else at
  rest — eight projects do not deserve a control bar. It opens a searchable list
  of four fields: Status, Type, Order (seven fields) and Direction. Each row
  shows what it currently holds and opens its values in a flyout; picking one
  applies it and closes the menu.
- **Clauses.** Whatever has moved off its default comes back as a clause next to
  the button — "Status is Active ×". The middle segment reopens the field it was
  made from, the last one puts it back. The order only shows once it is not the
  default, which is why the head is empty on arrival.
- **How it is wired.** Nothing in the page draws a control on its own: elements
  carry `data-set-*` to apply a value, `data-clear` to reset a dimension,
  `data-echo` to print a piece of the state and `data-chip` to hide themselves
  while their dimension is untouched. Any other arrangement of controls can be
  hung off the same attributes.
- **Status.** Each row leads with a dot and Active / Archived.
- Projects link to the live site when a URL exists.

## Where the control came from

Ten mock-ups were built before this one and none of them are in this branch:
they live in `previews-filters`, under `/dev`, with a page explaining what each
was for. Three rounds — a control bar redrawn until it was a rule, then a
question about where the direction of the order lives, then a question about how
much of the head the controls deserve at all. The last round is the one that
shipped, as `/dev/2d`.

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
