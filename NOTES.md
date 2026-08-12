# olisite — second concept round

Three restrained directions for a personal site. The work is the main content;
availability and contact are deliberately secondary. The comparison lives at
`/`, with one complete concept on each route.

| Route | Direction | Layout | Signature interaction |
|---|---|---|---|
| `/a` | **Sidecar** | Fixed personal sidebar and dark project index | Project rows make room for their logo on hover |
| `/b` | **Plainspoken** | Open, single-column personal note | Project logos follow the pointer on desktop |
| `/c` | **Shelf** | Monochrome technical personal index | Compact All / Active filter and an open grid |
| `/c1` | **Balanced profile** | Two-column project cards | Four equally weighted one-to-five ratings |
| `/c2` | **Impact first** | Horizontal project ranking | Large impact stars with three supporting ratings |
| `/c3` | **Comparison matrix** | Shared project-and-rating grid | Direct column-by-column star comparison |
| `/a1` | **Ratings under the description** | Sidecar `/a`, unchanged | The four ratings sit in a row below each blurb |
| `/a2` | **Ratings in the margin** | Sidecar `/a`, unchanged | The right-hand column carries the ratings, the blurb stays clear |
| `/a3` | **Ratings as a column** | Sidecar `/a`, unchanged | Ratings get their own column, so the row reads like a spec sheet |

## The A round

`/a1`, `/a2` and `/a3` are the same page as `/a` — same palette, type, layout,
copy and logo-on-hover row — with three additions and nothing else:

- **Ratings.** The same one-to-five stars as `/c1`, for craft, depth, utility and
  impact. The three variants only differ in where those stars live.
- **Filter and order.** All / Active, and eight orders: newest, oldest, A–Z,
  overall and each of the four ratings. Identical controls in the three, so the
  comparison is only about the ratings.
- **Status instead of the running number.** The `01`, `02`… slot now shows a dot
  and Active / Archived, which is information the number never carried.

The list is rendered on the server; `src/scripts/a-controls.ts` only reorders and
hides rows, so every project is still listed without JavaScript.

## Shared decisions

- **Geist Variable** and **Geist Mono Variable** are self-hosted with Fontsource.
- All visible copy is in English.
- Scores are shown as one-to-five ratings; the raw numbers and hours stay hidden.
- Project cards link to live projects when a URL exists.
- Every direction has a dedicated mobile layout and respects reduced-motion preferences.
- React is only used for the small filter island in direction C; the A round uses
  a plain shared module instead.

## Still needed for production

- Confirm the final biography and contact address.
- Replace any project logos that only exist as low-resolution raster files.
- Add project detail pages if the final site should tell the longer story behind each project.
- Connect the final project data to D1 once a direction is selected.
