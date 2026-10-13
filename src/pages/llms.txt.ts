import type { APIRoute } from 'astro';
import { llms } from '../features/discovery/markdown';
import { discoveryResponse } from '../features/discovery/response';
import { loadProjects } from '../features/projects/repository';

export const GET: APIRoute = (context) => discoveryResponse(context, 'text/plain', async () =>
  llms(context.site, await loadProjects('en')),
);
export const HEAD = GET;
