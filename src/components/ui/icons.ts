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
} as const satisfies Record<string, IconShape>;

export type IconName = keyof typeof ICONS;
