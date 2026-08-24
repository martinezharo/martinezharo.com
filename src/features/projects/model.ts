/**
 * The types a project can be. This is the list the database column is checked
 * against on the way in, so it is a value rather than only a type — a row
 * whose `kind` is not one of these has not been described and the showcase
 * cannot draw it.
 */
export const PROJECT_KINDS = ['ecommerce', 'marketplace', 'app', 'tool', 'brand'] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];

/**
 * What a project scores on each metric, or `null` where the metric does not
 * apply to it — a brand with no interface of its own is not judged on craft.
 * That is a different statement from a low score, and the list draws, orders
 * and announces it as one. Every key stays required so that leaving a project
 * off a scale has to be written down rather than forgotten.
 */
export type ProjectScores = Record<ScoreKey, number | null>;

export interface Project {
  slug: string;
  name: string;
  active: boolean;
  start: number;
  end: number | null;
  kind: ProjectKind;
  url: string | null;
  logo: string;
  blurb: string;
  scores: ProjectScores;
  stack: string[];
}

/**
 * A single project with the long-form fields the list never asks for: the story
 * split into paragraphs, and the repository behind it. Both are missing from
 * plenty of projects, so a detail page has to be able to draw without them.
 */
export interface ProjectDetail extends Project {
  history: string[];
  repo: string | null;
}

export type ScoreKey = 'craft' | 'depth' | 'utility' | 'impact';
export const SCORE_META: ReadonlyArray<{ key: ScoreKey }> = [
  { key: 'craft' },
  { key: 'depth' },
  { key: 'utility' },
  { key: 'impact' },
];

export type SortField = 'date' | 'name' | 'overall' | ScoreKey;
export type SortDirection = 'desc' | 'asc';
export type ProjectStatus = 'all' | 'active' | 'archived';

export const SORT_FIELDS: ReadonlyArray<{ key: SortField }> = [
  { key: 'date' },
  { key: 'name' },
  { key: 'overall' },
  { key: 'craft' },
  { key: 'depth' },
  { key: 'utility' },
  { key: 'impact' },
];

export const DEFAULT_PROJECT_STATE = {
  field: 'date',
  direction: 'desc',
  kind: 'all',
  status: 'all',
} as const satisfies {
  field: SortField;
  direction: SortDirection;
  kind: ProjectKind | 'all';
  status: ProjectStatus;
};

/** The metrics a project is on, in the order the card draws them. */
function ratedScores(project: Project): number[] {
  return SCORE_META.map((metric) => project.scores[metric.key]).filter(
    (score): score is number => score !== null,
  );
}

/**
 * The average of the ratings a project carries, or null when it carries none.
 * A metric that does not apply is left out of the average rather than counted
 * as a zero, so a project is never marked down for a scale it was never on.
 */
export function getOverallScore(project: Project): number | null {
  const scores = ratedScores(project);
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);
}

export function formatProjectRange(project: Project): string {
  if (!project.end) return `${project.start} —`;
  return project.end === project.start ? `${project.start}` : `${project.start}–${project.end}`;
}

export function toRating(score: number): number {
  return Math.max(1, Math.min(5, Math.round(score / 20)));
}
