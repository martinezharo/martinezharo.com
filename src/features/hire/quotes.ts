import type { Project } from '../projects/model';
import { PROJECT_QUOTES, type ProjectQuote } from './model';

export interface QuotedProject extends ProjectQuote {
  project: Project;
}

/**
 * The quotes joined to the portfolio rows they describe, most expensive first.
 * A quote whose project is missing from the list the showcase renders is left
 * out, for the same reason the showcase leaves the project out.
 */
export function quoteProjects(projects: readonly Project[]): QuotedProject[] {
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  return PROJECT_QUOTES.flatMap((quote) => {
    const project = bySlug.get(quote.slug);
    return project ? [{ ...quote, project }] : [];
  }).sort((left, right) => right.price - left.price);
}
