export type ProjectKind = 'ecommerce' | 'marketplace' | 'app' | 'tool' | 'brand';

export interface ProjectScores {
  craft: number;
  depth: number;
  utility: number;
  impact: number;
}

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
  hours: number;
  stack: string[];
}

export const KIND_LABEL: Record<ProjectKind, string> = {
  ecommerce: 'E-commerce',
  marketplace: 'Marketplace',
  app: 'App',
  tool: 'Tool',
  brand: 'Brand',
};

export const SCORE_META = [
  { key: 'craft', label: 'Craft', hint: 'Interface finish: composition, detail and interaction.' },
  { key: 'depth', label: 'Depth', hint: 'Technical complexity: architecture, integrations and edge cases.' },
  { key: 'utility', label: 'Utility', hint: 'How much the project solves for the people who use it.' },
  { key: 'impact', label: 'Impact', hint: 'Measurable results: sales, traffic and adoption.' },
] as const;

export type ScoreKey = (typeof SCORE_META)[number]['key'];
export type SortField = 'date' | 'name' | 'overall' | ScoreKey;
export type SortDirection = 'desc' | 'asc';
export type ProjectStatus = 'all' | 'active' | 'archived';

export const SORT_FIELDS: ReadonlyArray<{ key: SortField; label: string }> = [
  { key: 'date', label: 'Date' },
  { key: 'name', label: 'Name' },
  { key: 'overall', label: 'Overall rating' },
  { key: 'craft', label: 'Craft' },
  { key: 'depth', label: 'Depth' },
  { key: 'utility', label: 'Utility' },
  { key: 'impact', label: 'Impact' },
];

export const DIRECTION_LABEL: Record<SortField, Record<SortDirection, string>> = {
  date: { desc: 'Newest first', asc: 'Oldest first' },
  name: { desc: 'Z to A', asc: 'A to Z' },
  overall: { desc: 'Highest first', asc: 'Lowest first' },
  craft: { desc: 'Highest first', asc: 'Lowest first' },
  depth: { desc: 'Highest first', asc: 'Lowest first' },
  utility: { desc: 'Highest first', asc: 'Lowest first' },
  impact: { desc: 'Highest first', asc: 'Lowest first' },
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  all: 'Every status',
  active: 'Active',
  archived: 'Archived',
};

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

export function getOverallScore(project: Project): number {
  const values = Object.values(project.scores);
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

export function formatProjectRange(project: Project): string {
  if (!project.end) return `${project.start} —`;
  return project.end === project.start ? `${project.start}` : `${project.start}–${project.end}`;
}

export function toStarRating(score: number): number {
  return Math.max(1, Math.min(5, Math.round(score / 20)));
}
