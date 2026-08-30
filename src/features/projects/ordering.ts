import type { Locale } from '../../i18n';
import {
  DEFAULT_PROJECT_STATE,
  getOverallScore,
  getProjectSpan,
  getRatedScoreCount,
} from './model';
import type { Project, ProjectStatus, SortDirection, SortField } from './model';

// The rules the project list runs on, written once and away from the DOM.
//
// Two places need them and they must agree. The list orders rows the server
// already drew, in the browser, from data attributes; a project page orders
// rows straight out of the database, on the server, to work out which project
// comes after the one being read. If the two ever ordered differently, "next"
// would name a project the list would not have put next — which is the whole
// promise the link makes.

/**
 * What the list is showing: the two filters and the order it runs in. It is
 * one value because it travels as one — the list keeps it as the visitor
 * leaves, and a project page reads it back.
 */
export interface ProjectState {
  field: SortField;
  direction: SortDirection;
  kind: string;
  status: ProjectStatus;
}

/**
 * The least a project has to carry to be filtered and ordered. A project page
 * hands the browser only this much about the rest of the portfolio, plus what
 * the link draws, rather than the whole row.
 */
export type Listed = Pick<
  Project,
  'slug' | 'name' | 'kind' | 'active' | 'start' | 'started' | 'ended' | 'scores'
>;

/**
 * A row reduced to what ordering asks of it: the name it ties on, and what it
 * is worth on a given scale — or null when it is not on that scale at all.
 *
 * This is the shape the browser and the server meet on. An element carries its
 * ratings in data attributes and a project carries them in a record, and
 * neither has to be turned into the other for the comparison below to work.
 */
export interface Ranked {
  name: string;
  rated: number;
  value(field: SortField): number | null;
}

/** A project as something to be ordered. */
export function rank(project: Listed): Ranked {
  return {
    // Lowercased because the list sorts on the name it wrote into the row's
    // data attribute, which is lowercase. Both sides have to tie the same way.
    name: project.name.toLowerCase(),
    rated: getRatedScoreCount(project),
    value(field) {
      if (field === 'date') return project.start;
      if (field === 'span') return getProjectSpan(project);
      if (field === 'default') return getOverallScore(project);
      if (field === 'name') return null;
      return project.scores[field];
    },
  };
}

/**
 * Two rows on the chosen field, already turned round by the direction.
 *
 * A project that is not rated on the field being sorted has no place on that
 * scale, so it settles below every rated one whichever way the list runs. It
 * cannot be folded into the numbers: counted as a zero it would be the worst
 * project going down and the best one coming back up, and "not applicable" is
 * neither.
 *
 * Ties break on the name, ascending, whichever way the list runs — a tie is
 * not part of the ordering being asked for, so it should not flip with it.
 */
export function compareRanked(
  a: Ranked,
  b: Ranked,
  field: SortField,
  direction: SortDirection,
  locale: Locale,
): number {
  const byName = a.name.localeCompare(b.name, locale);
  const sign = direction === 'asc' ? 1 : -1;

  if (field === 'name') return byName * sign;

  // The default order favours projects that can be judged on more of the four
  // metrics. Only projects with the same coverage are compared by their
  // completeness-adjusted overall score.
  if (field === 'default') {
    const byCoverage = (a.rated - b.rated) * sign;
    if (byCoverage) return byCoverage;
  }

  const left = a.value(field);
  const right = b.value(field);
  if (left === null || right === null) {
    if (left !== right) return left === null ? 1 : -1;
    return byName;
  }

  return (left - right) * sign || byName;
}

/** Whether the filters in a state leave this project on the list. */
export function matchesState(project: Listed, state: ProjectState): boolean {
  if (state.kind !== 'all' && project.kind !== state.kind) return false;
  if (state.status === 'active') return project.active;
  if (state.status === 'archived') return !project.active;
  return true;
}

/** The projects a state leaves on the list, in the order it puts them in. */
export function orderProjects<T extends Listed>(
  projects: readonly T[],
  state: ProjectState,
  locale: Locale,
): T[] {
  return projects
    .filter((project) => matchesState(project, state))
    .sort((a, b) => compareRanked(rank(a), rank(b), state.field, state.direction, locale));
}

/**
 * The project that follows this one in the list the visitor was looking at, or
 * null when nothing follows it. Nothing follows the last one: the page then
 * offers no way on rather than wrapping round to the first, since a link back
 * to the top of a list you have reached the end of is a link that lies about
 * where you are — and the rail's way back to every project never left.
 *
 * A project the state filters out is not on that list at all, so there is no
 * "after this one" to answer with. Rather than take the way on away over a
 * filter the visitor set on another page and has no reason to remember, the
 * order falls back to the one the list starts in, over every project.
 */
export function nextProject<T extends Listed>(
  projects: readonly T[],
  slug: string,
  state: ProjectState,
  locale: Locale,
): T | null {
  const ordered = orderProjects(projects, state, locale);
  const list = ordered.some((project) => project.slug === slug)
    ? ordered
    : orderProjects(projects, DEFAULT_PROJECT_STATE, locale);

  const index = list.findIndex((project) => project.slug === slug);
  return index === -1 ? null : list[index + 1] ?? null;
}
