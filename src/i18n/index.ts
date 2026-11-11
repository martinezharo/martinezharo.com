import { de } from './de';
import { en } from './en';
import { es } from './es';
import type { LocaleCopy } from './types';

export type { LocaleCopy, MetricCopy, ServiceCopy, ServicesPageCopy } from './types';

export const LOCALES = ['en', 'es', 'de'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * How the switcher states a choice, and where that choice is kept.
 *
 * The root negotiates, so a Spanish reader asking for English at `/` would be
 * sent straight back to `/es` and the switch would look broken. The link asks
 * for the language out loud; the middleware records it and drops the query, so
 * the address bar keeps the clean URL and later visits to `/` obey the choice
 * instead of the browser's header.
 */
export const LOCALE_QUERY = 'lang';
export const LOCALE_COOKIE = 'locale';

/** Each language named in itself, for the switcher. */
export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', es: 'Español', de: 'Deutsch' };

/** How each language is spelled for Open Graph, which wants a region too. */
export const OPEN_GRAPH_LOCALES: Record<Locale, string> = { en: 'en_US', es: 'es_ES', de: 'de_DE' };

const copies: Record<Locale, LocaleCopy> = { en, es, de };

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

export function getCopy(locale: Locale): LocaleCopy {
  return copies[locale];
}

/**
 * Whether a first path segment is a locale that actually carries a prefix.
 *
 * English is the canonical language and is served unprefixed at the root, so
 * `/en/...` is deliberately not a route: the middleware sends it to its
 * unprefixed twin so the two never both answer for the same page.
 */
export function isPrefixedLocale(value: string | undefined): value is Locale {
  return isLocale(value) && value !== DEFAULT_LOCALE;
}

/** The locale-free route behind a path: `/es/projects/x` and `/projects/x` share `/projects/x`. */
export function routeFromPath(pathname: string): string {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    if (pathname === `/${locale}`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

/** Prefix a route with its locale, while keeping English canonical and unprefixed. */
export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized || '/';
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

/** Pick the best supported language from the browser's ordered preference list. */
export function preferredLocale(acceptLanguage: string | null): Locale {
  const preferences = (acceptLanguage ?? '')
    .split(',')
    .map((part, index) => {
      const [range, ...parameters] = part.trim().toLowerCase().split(';');
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith('q='));
      const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
      return { range: range?.trim() ?? '', quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter(({ range, quality }) => range !== '' && quality > 0)
    .sort((left, right) => right.quality - left.quality || left.index - right.index);

  for (const preference of preferences) {
    const primary = preference.range.split('-')[0];
    const match = LOCALES.find((locale) => locale === primary);
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}
