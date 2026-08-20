import type { IconName } from '../../components/ui/icons';
import { getCopy, type Locale } from '../../i18n';
import type { ProjectDetail } from './model';

/** One outbound link on a project's page: the mark that names it, and where it goes. */
export interface ProjectLink {
  icon: IconName;
  label: string;
  href: string;
}

/**
 * The links a project carries, in the order the page draws them. Plenty of
 * projects have no repository and a couple have nowhere to send anyone at all,
 * so the list is only ever as long as the record allows — the page lays out
 * what it gets back rather than leaving a hole where a link would be.
 *
 * Both rows say what pressing them does rather than where they land: an address
 * is for the browser's status bar, and a verb is what makes a row on a hairline
 * read as something to press.
 */
export function projectLinks(project: ProjectDetail, locale: Locale): ProjectLink[] {
  const copy = getCopy(locale).detail;
  const links: ProjectLink[] = [];

  if (project.url) links.push({ icon: 'globe', label: copy.visitSite, href: project.url });
  if (project.repo) links.push({ icon: 'github', label: copy.viewSource, href: project.repo });

  return links;
}
