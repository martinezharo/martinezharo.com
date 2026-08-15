import { env } from 'cloudflare:workers';
import { projectPresentation } from '../../data/project-presentation';
import type { Project } from './model';

// Reads the portfolio from the `oliweb` D1 database and joins each row with the
// presentation record that carries its type, ratings, hours and stack.

/** The columns of `projects` this site reads. The table holds more. */
interface ProjectRow {
  slug: string;
  name: string;
  is_active: number | null;
  start_date: string | null;
  end_date: string | null;
  url: string | null;
  logo_url: string | null;
  short_description_en: string | null;
}

const SELECT_PROJECTS = `
  SELECT slug, name, is_active, start_date, end_date, url, logo_url, short_description_en
  FROM projects
`;

/** Dates are stored as `YYYY-MM-DD`; the portfolio only ever shows the year. */
function year(date: string | null): number | null {
  const parsed = Number(date?.slice(0, 4));
  return Number.isInteger(parsed) ? parsed : null;
}

function toProject(row: ProjectRow): Project | null {
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
    blurb: row.short_description_en ?? '',
    ...presentation,
  };
}

/**
 * Every project the showcase can render, newest first — the order the list
 * starts in, so the page reads the same way before the client script sorts it.
 *
 * The database defaults to the `DB` binding; passing one in is for tests.
 */
export async function loadProjects(db: D1Database = env.DB): Promise<Project[]> {
  const { results } = await db.prepare(SELECT_PROJECTS).all<ProjectRow>();

  const projects: Project[] = [];
  const skipped: string[] = [];

  for (const row of results) {
    const project = toProject(row);
    if (project) projects.push(project);
    else skipped.push(row.slug);
  }

  if (skipped.length > 0) {
    console.warn(
      `[projects] skipped rows with no presentation record or start date: ${skipped.join(', ')}. ` +
        'Add them to src/data/project-presentation.ts.',
    );
  }

  return projects.sort((a, b) => b.start - a.start || a.name.localeCompare(b.name, 'en'));
}
