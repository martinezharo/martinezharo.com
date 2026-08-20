import { env } from 'cloudflare:workers';
import { projectPresentation } from '../../data/project-presentation';
import type { Locale } from '../../i18n';
import type { Project, ProjectDetail } from './model';

// Reads the portfolio from the `oliweb` D1 database and joins each row with the
// presentation record that carries its type, ratings, hours and stack. The
// description and history expressions are selected for the requested locale,
// with the other language as a safe fallback for an incomplete row.

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
}

interface ProjectDetailRow extends ProjectRow {
  history: string | null;
  github_url: string | null;
}

function localizedColumn(locale: Locale, field: 'short_description' | 'history'): string {
  const suffix = locale === 'es' ? 'es' : 'en';
  const fallback = locale === 'es' ? 'en' : 'es';
  return `COALESCE(NULLIF(${field}_${suffix}, ''), ${field}_${fallback})`;
}

function selectProjects(locale: Locale): string {
  return `
    SELECT slug, name, is_active, start_date, end_date, url, logo_url,
      ${localizedColumn(locale, 'short_description')} AS short_description
    FROM projects
  `;
}

function selectProject(locale: Locale): string {
  return `
    SELECT slug, name, is_active, start_date, end_date, url, logo_url,
      ${localizedColumn(locale, 'short_description')} AS short_description,
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

function toProject(row: ProjectRow, locale: Locale): Project | null {
  const presentation = projectPresentation[row.slug];
  const start = year(row.start_date);
  if (!presentation || start === null) return null;

  return {
    slug: row.slug,
    name: row.name,
    active: row.is_active === 1,
    start,
    end: year(row.end_date),
    url: row.url,
    logo: row.logo_url ?? '',
    blurb: row.short_description ?? '',
    ...presentation,
    stack: presentation.stack[locale],
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
 * such row — or when the row has no presentation record, which is the same
 * reason the showcase would have left it out of the list.
 */
export async function loadProject(
  slug: string,
  locale: Locale,
  db: D1Database = env.DB,
): Promise<ProjectDetail | null> {
  const row = await db.prepare(selectProject(locale)).bind(slug).first<ProjectDetailRow>();
  if (!row) return null;

  const project = toProject(row, locale);
  if (!project) return null;

  return { ...project, history: paragraphs(row.history), repo: row.github_url };
}

/**
 * Every project the showcase can render, newest first — the order the list
 * starts in, so the page reads the same way before the client script sorts it.
 *
 * The database defaults to the `DB` binding; passing one in is for tests.
 */
export async function loadProjects(locale: Locale, db: D1Database = env.DB): Promise<Project[]> {
  const { results } = await db.prepare(selectProjects(locale)).all<ProjectRow>();

  const projects: Project[] = [];
  const skipped: string[] = [];

  for (const row of results) {
    const project = toProject(row, locale);
    if (project) projects.push(project);
    else skipped.push(row.slug);
  }

  if (skipped.length > 0) {
    console.warn(
      `[projects] skipped rows with no presentation record or start date: ${skipped.join(', ')}. ` +
        'Add them to src/data/project-presentation.ts.',
    );
  }

  return projects.sort((a, b) => b.start - a.start || a.name.localeCompare(b.name, locale));
}
