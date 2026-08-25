import type { Project } from './model';
import type { Listed } from './ordering';

/**
 * What a project page tells the browser about every other project.
 *
 * The link at the foot of a story is worked out from the order the visitor
 * left the list in, and that order is only known once the page is running — so
 * the page ships the portfolio with it rather than asking for it again. This
 * is the smallest version of a project that can be filtered, ordered and then
 * drawn as that link: no story, no stack, no address of its own.
 */
export type NextCandidate = Listed & Pick<Project, 'blurb' | 'logo'>;

export function toCandidates(projects: readonly Project[]): NextCandidate[] {
  return projects.map(({ slug, name, kind, active, start, scores, blurb, logo }) => ({
    slug,
    name,
    kind,
    active,
    start,
    scores,
    blurb,
    logo,
  }));
}
