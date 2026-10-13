import type { Project } from '../projects/model';
import { LOCALES, localizedPath } from '../../i18n';
import { absoluteUrl, projectPath } from './urls';

function xml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  })[character]!);
}

export function sitemap(origin: URL | undefined, projects: readonly Project[]): string {
  const routes = ['/', '/stack', ...projects.map((project) => projectPath(project.slug))];
  const entries = routes.flatMap((route) => {
    const alternates = [...LOCALES.map((locale) => ({
      language: locale,
      url: absoluteUrl(localizedPath(locale, route), origin),
    })), { language: 'x-default', url: absoluteUrl(route, origin) }];
    return LOCALES.map((locale) => {
      const url = absoluteUrl(localizedPath(locale, route), origin);
      return `  <url>\n    <loc>${xml(url)}</loc>\n${alternates.map((alternate) =>
        `    <xhtml:link rel="alternate" hreflang="${alternate.language}" href="${xml(alternate.url)}" />`,
      ).join('\n')}\n  </url>`;
    });
  });
  // There is no content-updated timestamp in the database. Omitting lastmod
  // is more accurate than assigning today's date or the project's start date.
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
}
