import type { Project } from '../projects/model';
import { projectPath } from '../discovery/urls';
import { PROJECT_QUOTES, SITE_QUOTE, type QuoteDuration } from './model';

export interface QuotedProject {
  name: string;
  logo: string;
  /** Where the entry leads, as a route without the locale prefix. */
  path: string;
  price: number;
  duration: QuoteDuration;
  /** The logo is transparent and needs a plate behind it. */
  plate?: boolean;
}

/**
 * The quotes joined to the portfolio rows they describe, plus this site, most
 * expensive first. A quote whose project is missing from the list the showcase
 * renders is left out, for the same reason the showcase leaves the project out.
 * `siteName` is the already translated name of this site's own entry.
 */
export function quoteProjects(projects: readonly Project[], siteName: string): QuotedProject[] {
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const quoted = PROJECT_QUOTES.flatMap((quote) => {
    const project = bySlug.get(quote.slug);
    return project
      ? [{ name: project.name, logo: project.logo, path: projectPath(project.slug), price: quote.price, duration: quote.duration }]
      : [];
  });
  quoted.push({ name: siteName, ...SITE_QUOTE });
  return quoted.sort((left, right) => right.price - left.price);
}
