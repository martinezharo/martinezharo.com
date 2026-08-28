import { env } from 'cloudflare:workers';
import type { Locale } from '../../i18n';
import type { Project, ProjectDetail, ProjectKind, ProjectScores } from './model';
import { DEFAULT_PROJECT_STATE, PROJECT_KINDS, SCORE_META } from './model';
import { orderProjects } from './ordering';

// Reads the portfolio from the `oliweb` D1 database. Everything a project is
// and everything the portfolio says about it lives on the same row, so the
// admin panel can put a project on the site without a deploy. The description
// and history expressions are selected for the requested locale, with the
// other language as a safe fallback for an incomplete row. The stack is not
// one of them: tool names are the same in either language.

/** The columns of `projects` this site reads. The table holds more. */
interface ProjectRow {
  slug: string;
  name: string;
  is_active: number | null;
  start_date: string | null;
  end_date: string | null;
  url: string | null;
  logo_url: string | null;
  short_description: string | null;
  kind: string | null;
  score_design: number | null;
  score_engineering: number | null;
  score_impact: number | null;
  score_maturity: number | null;
  stack: string | null;
}

interface ProjectDetailRow extends ProjectRow {
  history: string | null;
  github_url: string | null;
}

type LocalizedField = 'short_description' | 'history';

function localizedColumn(locale: Locale, field: LocalizedField): string {
  const suffix = locale === 'es' ? 'es' : 'en';
  const fallback = locale === 'es' ? 'en' : 'es';
  return `COALESCE(NULLIF(${field}_${suffix}, ''), ${field}_${fallback})`;
}

/** The columns every query needs, in both the list and the detail shape. */
function commonColumns(locale: Locale): string {
  return `slug, name, is_active, start_date, end_date, url, logo_url,
      kind, score_design, score_engineering, score_impact, score_maturity, stack,
      ${localizedColumn(locale, 'short_description')} AS short_description`;
}

function selectProjects(locale: Locale): string {
  return `
    SELECT ${commonColumns(locale)}
    FROM projects
  `;
}

function selectProject(locale: Locale): string {
  return `
    SELECT ${commonColumns(locale)},
      ${localizedColumn(locale, 'history')} AS history, github_url
    FROM projects
    WHERE slug = ?1
  `;
}

/** Dates are stored as `YYYY-MM-DD`; the portfolio only ever shows the year. */
function year(date: string | null): number | null {
  const parsed = Number(date?.slice(0, 4));
  return Number.isInteger(parsed) ? parsed : null;
}

/**
 * The type of a project, or null when the column holds something this site has
 * no way to draw — including the NULL a row carries before anyone has said
 * what it is. Either way the showcase leaves the project out rather than
 * guessing, which is what it did when the type lived in a source file and the
 * row had no entry there.
 */
function toKind(value: string | null): ProjectKind | null {
  return PROJECT_KINDS.find((kind) => kind === value) ?? null;
}

/**
 * The stack is stored as a JSON array of tool names. A row whose column is
 * empty, malformed or not an array of strings draws no tools at all — the same
 * as a project that named none.
 */
function toStack(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((tool): tool is string => typeof tool === 'string' && tool !== '');
  } catch {
    return [];
  }
}

/**
 * The four ratings, 1 to 5 — one segment of the meter each, so nothing is
 * rounded on the way out. A column left NULL means the metric does not apply to
 * the project, which the card, the ordering and the announcement all treat as
 * its own state rather than as a zero.
 */
function toScores(row: ProjectRow): ProjectScores {
  const columns = {
    design: row.score_design,
    engineering: row.score_engineering,
    impact: row.score_impact,
    maturity: row.score_maturity,
  };

  return Object.fromEntries(
    SCORE_META.map((metric) => [
      metric.key,
      typeof columns[metric.key] === 'number' ? columns[metric.key] : null,
    ]),
  ) as ProjectScores;
}

function toProject(row: ProjectRow): Project | null {
  const kind = toKind(row.kind);
  const start = year(row.start_date);
  if (!kind || start === null) return null;

  return {
    slug: row.slug,
    name: row.name,
    active: row.is_active === 1,
    start,
    end: year(row.end_date),
    kind,
    url: row.url,
    logo: row.logo_url ?? '',
    blurb: row.short_description ?? '',
    scores: toScores(row),
    stack: toStack(row.stack),
  };
}

/**
 * The story is stored as one field with a blank line between paragraphs, which
 * is how it was written; a project with no story at all comes back as no
 * paragraphs rather than one empty one.
 */
function paragraphs(history: string | null): string[] {
  return (history ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/**
 * One project by slug, with its story and repository, or null when there is no
 * such row — or when the row has no type or no start date, which is the same
 * reason the showcase would have left it out of the list.
 */
export async function loadProject(
  slug: string,
  locale: Locale,
  db: D1Database = env.DB,
): Promise<ProjectDetail | null> {
  const row = await db.prepare(selectProject(locale)).bind(slug).first<ProjectDetailRow>();
  if (!row) return null;

  const project = toProject(row);
  if (!project) return null;

  return { ...project, history: paragraphs(row.history), repo: row.github_url };
}

/**
 * Every project the showcase can render, in the default order: projects rated
 * on more metrics first, then by overall score within the same coverage.
 *
 * The database defaults to the `DB` binding; passing one in is for tests.
 */
export async function loadProjects(locale: Locale, db: D1Database = env.DB): Promise<Project[]> {
  const { results } = await db.prepare(selectProjects(locale)).all<ProjectRow>();

  const projects: Project[] = [];
  const skipped: string[] = [];

  for (const row of results) {
    const project = toProject(row);
    if (project) projects.push(project);
    else skipped.push(row.slug);
  }

  if (skipped.length > 0) {
    console.warn(
      `[projects] skipped rows with no type or no start date: ${skipped.join(', ')}. ` +
        'Give them one in the admin panel.',
    );
  }

  return orderProjects(projects, DEFAULT_PROJECT_STATE, locale);
}
