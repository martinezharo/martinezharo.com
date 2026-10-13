import type { APIRoute } from 'astro';
import { discoveryResponse } from '../features/discovery/response';
import { sitemap } from '../features/discovery/sitemap';
import { loadProjects } from '../features/projects/repository';

export const GET: APIRoute = (context) => discoveryResponse(context, 'application/xml', async () =>
  sitemap(context.site, await loadProjects('en')),
);
export const HEAD = GET;
