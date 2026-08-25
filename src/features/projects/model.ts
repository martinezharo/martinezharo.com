/**
 * The types a project can be. This is the list the database column is checked
 * against on the way in, so it is a value rather than only a type — a row
 * whose `kind` is not one of these has not been described and the showcase
 * cannot draw it.
 */
export const PROJECT_KINDS = ['ecommerce', 'marketplace', 'app', 'tool', 'brand'] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];

/**
 * What a project scores on each metric, 1 to 5 — the scale the meter draws, so
 * there is no number behind the segments finer than the segments themselves.
 *
 * `null` where the metric does not apply to the project: a brand with no
 * interface of its own is not judged on design. That is a different statement
 * from a low score, and the list draws, orders and announces it as one. Every
 * key stays required so that leaving a project off a scale has to be written
 * down rather than forgotten.
 */
export type ProjectScores = Record<ScoreKey, number | null>;

/** The segments a meter draws, and the top of the scale a score is out of. */
export const SCORE_MAX = 5;

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

export type ScoreKey = 'design' | 'engineering' | 'value' | 'maturity';
export const SCORE_META: ReadonlyArray<{ key: ScoreKey }> = [
  { key: 'design' },
  { key: 'engineering' },
  { key: 'value' },
  { key: 'maturity' },
];

export type SortField = 'date' | 'name' | 'overall' | ScoreKey;
export type SortDirection = 'desc' | 'asc';
export type ProjectStatus = 'all' | 'active' | 'archived';

export const SORT_FIELDS: ReadonlyArray<{ key: SortField }> = [
  { key: 'date' },
  { key: 'name' },
  { key: 'overall' },
  { key: 'design' },
  { key: 'engineering' },
  { key: 'value' },
  { key: 'maturity' },
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
function ratedScores(project: Pick<Project, 'scores'>): number[] {
  return SCORE_META.map((metric) => project.scores[metric.key]).filter(
    (score): score is number => score !== null,
  );
}

/**
 * The average of a project's ratings over every metric, or null when it carries
 * none at all. A metric left unrated counts as a zero: the scales are the same
 * four for every project, so a blank is a gap in the project rather than a
 * scale it was never on.
 *
 * Left unrounded, to two places. Nothing prints this — it is the key the list
 * orders by — and on a scale with five stops, rounding it would put half the
 * portfolio on the same rung and leave the order to the tie-break.
 */
export function getOverallScore(project: Pick<Project, 'scores'>): number | null {
  const scores = ratedScores(project);
  if (scores.length === 0) return null;
  const mean = scores.reduce((total, score) => total + score, 0) / SCORE_META.length;
  return Math.round(mean * 100) / 100;
}

export function formatProjectRange(project: Project): string {
  if (!project.end) return `${project.start} —`;
  return project.end === project.start ? `${project.start}` : `${project.start}–${project.end}`;
}
