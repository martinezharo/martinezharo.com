import type { APIRoute } from 'astro';
import { absoluteUrl } from '../features/discovery/urls';

export const prerender = true;
export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml', site)}\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
