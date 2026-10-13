import { localizedPath, type Locale } from '../../i18n';

export function projectPath(slug: string): string {
  return `/projects/${encodeURIComponent(slug)}`;
}

export function markdownPath(locale: Locale, route: string): string {
  return localizedPath(locale, route === '/' ? '/index.md' : `${route}.md`);
}

export function absoluteUrl(path: string, origin: URL | undefined): string {
  if (!origin) throw new Error('The Astro site URL is required for discovery documents.');
  return new URL(path, origin).href;
}
