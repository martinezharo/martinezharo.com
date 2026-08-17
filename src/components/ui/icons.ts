/**
 * Every icon on the site, drawn on its own grid at the exact pixel size it is
 * painted at — one viewBox unit is one pixel, so nothing is ever scaled and the
 * stroke lands on the same weight everywhere. Icon.astro supplies the stroke,
 * the caps and the joins; an entry here is only the geometry.
 */
export interface IconShape {
  /** Side of the square-ish grid, in pixels. */
  width: number;
  height: number;
  /** Sub-paths, drawn in order. */
  paths: string[];
  /**
   * Painted rather than drawn. A borrowed mark like GitHub's only exists as a
   * solid shape, so it opts out of the stroke the rest of the set shares.
   */
  filled?: true;
}

export const ICONS = {
  /**
   * Three rules of decreasing length. Each one is centred on x=7 and the set is
   * centred on y=7, so the icon sits square in its box.
   */
  filters: {
    width: 14,
    height: 14,
    paths: ['M1.5 3.5h11M3.5 7h7M5.5 10.5h3'],
  },

  /** The handle starts inside the ring's stroke so the two read as one shape. */
  search: {
    width: 12,
    height: 12,
    paths: ['M5.2 1.6a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2', 'M8 8l2.6 2.6'],
  },

  chevron: {
    width: 6,
    height: 10,
    paths: ['M1 1l4 4-4 4'],
  },

  check: {
    width: 12,
    height: 10,
    paths: ['M1 5l3.4 3.4L11 1.6'],
  },

  clear: {
    width: 9,
    height: 9,
    paths: ['M1.4 1.4l6.2 6.2M7.6 1.4l-6.2 6.2'],
  },

  /**
   * A ring, its equator and the two meridians that turn it into a globe. Drawn
   * on the 16px grid the GitHub mark needs, so the two sit level beside a link.
   */
  globe: {
    width: 16,
    height: 16,
    paths: [
      'M8 1.4a6.6 6.6 0 1 1 0 13.2A6.6 6.6 0 0 1 8 1.4',
      'M1.6 8h12.8',
      'M8 1.4c-2.1 2.6-2.1 10.6 0 13.2',
      'M8 1.4c2.1 2.6 2.1 10.6 0 13.2',
    ],
  },

  /** The GitHub mark, on its own 16px grid and painted, not stroked. */
  github: {
    width: 16,
    height: 16,
    filled: true,
    paths: [
      'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z',
    ],
  },
} as const satisfies Record<string, IconShape>;

export type IconName = keyof typeof ICONS;
