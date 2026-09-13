/**
 * Where a site keeps its own mark.
 *
 * A project's row carries the address of the site and nothing else, so the
 * icon beside "visit site" has to be found rather than looked up: the page is
 * read for the icons it declares, and `/favicon.ico` is the guess every site
 * answers to whether or not it says so. The result is the site's own mark on
 * the row instead of the same drawn globe for every project.
 */

/** As much of a page as it takes to reach the end of its `<head>`. */
const HEAD_LIMIT = 200_000;
/** A mark is a small file. Anything larger is a photograph, not an icon. */
export const ICON_LIMIT = 300_000;
/** Neither fetch is allowed to hold the response open. */
const TIMEOUT_MS = 4000;

/** The `rel` values that name an icon, and what each one is worth. */
const ICON_RELS: Record<string, number> = {
  icon: 3,
  'shortcut icon': 3,
  'apple-touch-icon': 2,
  'apple-touch-icon-precomposed': 2,
  'mask-icon': 0,
};

interface Candidate {
  href: string;
  score: number;
}

/** `<link ...>` tags, without needing a parser the Worker does not have. */
function linkTags(html: string): string[] {
  return html.match(/<link\b[^>]*>/gi) ?? [];
}

function attribute(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'i'));
  if (!match) return null;
  return (match[2] ?? match[3] ?? match[4] ?? '').trim();
}

/**
 * The largest square a `sizes` attribute claims. It is only a tie-breaker: a
 * site that declares one icon at 16px and one at 192px meant the big one to be
 * the one you scale down.
 */
function declaredSize(tag: string): number {
  const sizes = attribute(tag, 'sizes');
  if (!sizes) return 0;
  const numbers = sizes.match(/\d+/g);
  if (!numbers) return 0;
  return Math.max(...numbers.map(Number));
}

/**
 * Every icon a page declares, best first. Scoring is coarse on purpose: what
 * matters is that a real icon beats the `/favicon.ico` guess, and that a mark
 * meant to be seen at size beats one drawn for a 16px tab.
 */
export function iconCandidates(html: string, pageUrl: string): string[] {
  const found: Candidate[] = [];

  for (const tag of linkTags(html)) {
    const rel = attribute(tag, 'rel')?.toLowerCase();
    const href = attribute(tag, 'href');
    if (!rel || !href) continue;

    const weight = ICON_RELS[rel];
    if (weight === undefined || weight === 0) continue;

    const resolved = absolute(href, pageUrl);
    if (resolved) found.push({ href: resolved, score: weight * 1000 + Math.min(declaredSize(tag), 512) });
  }

  found.sort((a, b) => b.score - a.score);

  const ordered = found.map((candidate) => candidate.href);
  const fallback = absolute('/favicon.ico', pageUrl);
  if (fallback && !ordered.includes(fallback)) ordered.push(fallback);

  return ordered;
}

/** An icon's address, or null when the page pointed somewhere unfetchable. */
function absolute(href: string, base: string): string | null {
  try {
    const url = new URL(href, base);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...init,
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      // Some sites hand a bare client their landing page instead of the asset.
      'User-Agent': 'Mozilla/5.0 (compatible; martinezharo.com favicon fetcher)',
      ...(init.headers ?? {}),
    },
  });
}

/** What a fetched mark is: the bytes and the type to hand the browser back. */
export interface FetchedIcon {
  body: ArrayBuffer;
  contentType: string;
}

/**
 * The site's mark, or null when it has none to give. A 404 that answers with a
 * page rather than an image is the common case here, so the content type is
 * what decides whether a response is an icon — not its status alone.
 */
export async function fetchIcon(siteUrl: string): Promise<FetchedIcon | null> {
  let candidates: string[];

  try {
    const page = await fetchWithTimeout(siteUrl);
    const html = page.ok ? (await page.text()).slice(0, HEAD_LIMIT) : '';
    candidates = iconCandidates(html, page.url || siteUrl);
  } catch {
    candidates = iconCandidates('', siteUrl);
  }

  for (const candidate of candidates) {
    const icon = await tryIcon(candidate);
    if (icon) return icon;
  }

  return null;
}

async function tryIcon(url: string): Promise<FetchedIcon | null> {
  try {
    const response = await fetchWithTimeout(url);
    if (!response.ok) return null;

    const contentType = (response.headers.get('content-type') ?? '').split(';')[0].trim();
    if (!contentType.startsWith('image/')) return null;

    const body = await response.arrayBuffer();
    if (body.byteLength === 0 || body.byteLength > ICON_LIMIT) return null;

    return { body, contentType };
  } catch {
    return null;
  }
}
