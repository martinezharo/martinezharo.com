import { defineMiddleware } from 'astro:middleware';

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

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Only whole pages that came back intact: a 404 or a redirect is cheap to
  // repeat and much more annoying to have stuck in a cache. HEAD is in because
  // it is meant to answer with the headers its GET would have carried.
  const isPage =
    (context.request.method === 'GET' || context.request.method === 'HEAD') &&
    response.status === 200 &&
    (response.headers.get('content-type') ?? '').startsWith('text/html');

  if (isPage) response.headers.set('Cache-Control', PAGE_CACHE);

  return response;
});
