import type { APIContext } from 'astro';

const DISCOVERY_CACHE = 'discovery-v1';
const CACHE_CONTROL = 'public, max-age=300, s-maxage=3600';

/** Public documents have no cookie/header variants. Query strings do not
 * multiply the D1 reads, and only successful GET bodies enter the edge cache.
 * Cache misses read at most one project-list scan or one slug lookup. */
export async function discoveryResponse(
  context: APIContext,
  contentType: string,
  render: () => Promise<string | null>,
): Promise<Response> {
  const key = new Request(`${context.url.origin}${context.url.pathname}`);
  let cache: Cache | undefined;
  try {
    cache = await caches.open(DISCOVERY_CACHE);
    const cached = await cache.match(key);
    if (cached) {
      return context.request.method === 'HEAD'
        ? new Response(null, { status: cached.status, headers: cached.headers })
        : cached;
    }
  } catch (error) {
    console.warn('[discovery] cache lookup failed', error);
  }

  const body = await render();
  if (body === null) return new Response('Not found', { status: 404 });
  const response = new Response(body, {
    headers: {
      'Content-Type': `${contentType}; charset=utf-8`,
      'Cache-Control': CACHE_CONTROL,
      'X-Content-Type-Options': 'nosniff',
    },
  });
  if (cache && context.request.method === 'GET') {
    const write = cache.put(key, response.clone()).catch((error: unknown) => {
      console.warn('[discovery] cache write failed', error);
    });
    context.locals.cfContext.waitUntil(write);
  }
  return context.request.method === 'HEAD'
    ? new Response(null, { headers: response.headers })
    : response;
}
