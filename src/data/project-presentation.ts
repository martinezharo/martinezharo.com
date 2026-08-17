import type { ProjectKind, ProjectScores } from '../features/projects/model';

// The `projects` table in D1 holds what a project *is*: name, dates, link, logo
// and description. It does not hold how the portfolio talks about it, so the
// type, the four ratings, the hours and the stack live here, keyed by the same
// slug. A project without an entry here cannot be filtered, sorted or rated, so
// the showcase leaves it out rather than inventing numbers for it.
//
// A single rating can be `null` when the metric does not apply to the project —
// see `ProjectScores`. Reach for it only when the scale itself is wrong for the
// work, never when a score would simply be low.

export interface ProjectPresentation {
  kind: ProjectKind;
  scores: ProjectScores;
  hours: number;
  stack: string[];
}

export const projectPresentation: Record<string, ProjectPresentation> = {
  'octopus-control': {
    kind: 'ecommerce',
    scores: { craft: 88, depth: 82, utility: 94, impact: 97 },
    hours: 2100,
    stack: ['Astro', 'Workers', 'D1', 'Stripe'],
  },
  fewya: {
    kind: 'marketplace',
    scores: { craft: 92, depth: 95, utility: 86, impact: 61 },
    hours: 1400,
    stack: ['Astro', 'Workers', 'D1', 'R2', 'Queues'],
  },
  klipcode: {
    kind: 'app',
    scores: { craft: 94, depth: 74, utility: 88, impact: 48 },
    hours: 520,
    stack: ['React', 'IndexedDB', 'Workers'],
  },
  rankmaker: {
    kind: 'app',
    scores: { craft: 86, depth: 79, utility: 81, impact: 72 },
    hours: 760,
    stack: ['Astro', 'Durable Objects', 'D1'],
  },
  oliverp: {
    kind: 'tool',
    scores: { craft: 71, depth: 90, utility: 96, impact: 68 },
    hours: 980,
    stack: ['React', 'Workers', 'D1', 'Hyperdrive'],
  },
  'goal-partner': {
    kind: 'app',
    scores: { craft: 74, depth: 66, utility: 42, impact: 21 },
    hours: 240,
    stack: ['Astro', 'Workers', 'KV'],
  },
  elitebara: {
    kind: 'ecommerce',
    scores: { craft: 63, depth: 48, utility: 55, impact: 34 },
    hours: 310,
    stack: ['Shopify', 'Liquid'],
  },
  kenobismo: {
    kind: 'brand',
    // No interface of its own to judge: the work is content and community, so
    // craft has nothing to measure here.
    scores: { craft: null, depth: 22, utility: 60, impact: 77 },
    hours: 1500,
    stack: ['Contenido', 'Community'],
  },
};
