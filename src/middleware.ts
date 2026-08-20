import { defineMiddleware } from 'astro:middleware';
import { localizedPath, preferredLocale } from './i18n';

// Every page here is public, read-only and rendered from the same handful of D1
// rows, so the browser is allowed to keep one rather than ask for it again on
// the way back from a project — which is the trip this site is mostly made of.
//
// A minute is the whole budget: long enough that moving between the list and a
// project costs no network at all, short enough that a record edited in the
// admin panel is still visible while you are looking for it. That trade is why
// these pages are rendered per request instead of built.
//
// `s-maxage` is here for a Cloudflare cache rule to pick up. A Worker does not
// cache its own responses, so until such a rule exists this line only ever
// reaches the browser.
const PAGE_CACHE = 'public, max-age=60, s-maxage=60';

// The one page whose body depends on a request header cannot be held in a
// shared cache. Cloudflare honours `Vary` for `Accept-Encoding` and nothing
// else, so a cached English root would be handed to Spanish readers for the
// rest of the minute. `private` keeps the same minute of browser caching and
// takes the CDN out of the decision entirely.
const NEGOTIATED_CACHE = 'private, max-age=60';

/** The root is the only page that guesses; every other URL states its language. */
function negotiates(pathname: string): boolean {
  return pathname === '/';
}

/**
 * English moved to the root, so the `/en/...` URLs the previous site had
 * indexed point at their unprefixed twin. This is the only reason the prefix
 * is still recognised at all, and a permanent redirect is what folds the old
 * addresses into the new ones rather than leaving both in the index.
 */
function unprefixEnglish(url: URL): Response | null {
  if (url.pathname !== '/en' && !url.pathname.startsWith('/en/')) return null;

  const target = new URL(url);
  target.pathname = url.pathname.slice(3) || '/';
  return new Response(null, {
    status: 301,
    headers: { Location: target.toString(), 'Cache-Control': PAGE_CACHE },
  });
}

/**
 * A reader who asked for Spanish gets Spanish, but only when they arrived at a
 * URL that named no language. Anything under `/projects/` or `/es/` was chosen,
 * and overriding a chosen address would leave no way to read the other version
 * — and would keep a crawler from ever seeing it.
 */
function chooseLocale(url: URL, request: Request): Response | null {
  if (!negotiates(url.pathname)) return null;
  if (preferredLocale(request.headers.get('accept-language')) !== 'es') return null;

  const target = new URL(url);
  target.pathname = localizedPath('es', url.pathname);
  return new Response(null, {
    status: 302,
    headers: {
      Location: target.toString(),
      'Cache-Control': 'no-store',
      Vary: 'Accept-Language',
    },
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const isRead = context.request.method === 'GET' || context.request.method === 'HEAD';

  if (isRead) {
    const redirect = unprefixEnglish(url) ?? chooseLocale(url, context.request);
    if (redirect) return redirect;
  }

  const response = await next();

  // Only whole pages that came back intact: a 404 or a redirect is cheap to
  // repeat and much more annoying to have stuck in a cache. HEAD is in because
  // it is meant to answer with the headers its GET would have carried.
  const isPage =
    isRead &&
    response.status === 200 &&
    (response.headers.get('content-type') ?? '').startsWith('text/html');

  if (isPage) {
    if (negotiates(url.pathname)) {
      response.headers.set('Cache-Control', NEGOTIATED_CACHE);
      response.headers.set('Vary', 'Accept-Language');
    } else {
      response.headers.set('Cache-Control', PAGE_CACHE);
    }
  }

  return response;
});
