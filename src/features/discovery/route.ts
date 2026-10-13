import type { APIRoute } from 'astro';
import { profileMarkdown, projectMarkdown, stackMarkdown } from './markdown';
import { discoveryResponse } from './response';
import { loadProject, loadProjects } from '../projects/repository';
import { isPrefixedLocale } from '../../i18n';

export const markdownRoute: APIRoute = (context) => discoveryResponse(context, 'text/markdown', async () => {
  const prefix = context.params.locale;
  if (prefix !== undefined && !isPrefixedLocale(prefix)) return null;
  const locale = prefix ?? 'en';
  if (context.params.slug) {
    const project = await loadProject(context.params.slug, locale);
    return project ? projectMarkdown(context.site, locale, project) : null;
  }
  if (context.url.pathname.endsWith('/stack.md')) {
    return stackMarkdown(context.site, locale);
  }
  return profileMarkdown(context.site, locale, await loadProjects(locale));
});
