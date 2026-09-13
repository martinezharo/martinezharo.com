import type { APIRoute } from 'astro';
import { fetchIcon } from '../../../features/projects/favicon';
import { loadProject } from '../../../features/projects/repository';

// The mark of the site a project links to, served from this origin.
//
// The address is read from the project's own row rather than taken from the
// query, so this is a route for the handful of sites the portfolio links to
// and not a proxy for anything a caller names.
//
// Fetching someone else's page to find their icon is far too slow to do while
// rendering, so the row's `visit site` link points here and the browser asks
// for the image the way it asks for any other. A mark changes about as often
// as the site is redesigned, so the answer is held for a day — and a site with
// no mark at all answers 404, which is what leaves the drawn globe in place.

const ICON_CACHE = 'public, max-age=86400, s-maxage=604800';
const MISS_CACHE = 'public, max-age=3600';

export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  if (!slug) return miss();

  // A Worker does not cache its own responses, and this one costs two requests
  // to another origin, so the result is put in the Worker's cache by hand.
  const cache = await caches.open('project-icons');
  const key = new Request(new URL(request.url).toString(), { method: 'GET' });
  const cached = await cache.match(key);
  if (cached) return cached;

  const project = await loadProject(slug, 'en');
  if (!project?.url) return miss();

  const icon = await fetchIcon(project.url);
  if (!icon) return miss();

  const response = new Response(icon.body, {
    headers: {
      'Content-Type': icon.contentType,
      'Cache-Control': ICON_CACHE,
    },
  });

  await cache.put(key, response.clone());
  return response;
};

/** No mark to hand back: the page falls back to the icon it draws itself. */
function miss(): Response {
  return new Response(null, { status: 404, headers: { 'Cache-Control': MISS_CACHE } });
}
