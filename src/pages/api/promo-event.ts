import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { PROMO_NAME, parsePromoEvent } from '../../features/promo/model';

/** A promo event is six short fields; anything bigger is not one. */
const MAX_BYTES = 256;

interface PromoEnv {
  PROMO_ANALYTICS?: AnalyticsEngineDataset;
}

function empty(status: number): Response {
  return new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });
}

/** The whole body, or null as soon as it passes `MAX_BYTES`, whatever it claimed its length was. */
async function readBounded(request: Request): Promise<Uint8Array | null> {
  const declared = request.headers.get('content-length');
  if (declared !== null && Number(declared) > MAX_BYTES) return null;
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

/**
 * A step a promo visitor took (src/features/promo/client.ts), counted into the
 * `promo_events` dataset the other sites of the funnel also write and the
 * private promo-stats dashboard reads. Nothing about the visitor is kept.
 */
export const POST: APIRoute = async ({ request, url }) => {
  // Only this site's own pages: another site must not add to the counts.
  const origin = request.headers.get('Origin');
  if (origin !== null && origin !== url.origin) return empty(403);

  const type = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  if (type !== 'application/json') return empty(415);

  let value: unknown;
  try {
    const bytes = await readBounded(request);
    if (!bytes) return empty(413);
    value = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return empty(400);
  }
  const event = parsePromoEvent(value);
  if (!event) return empty(400);

  try {
    (env as unknown as PromoEnv).PROMO_ANALYTICS?.writeDataPoint({
      blobs: [event.event, event.source, event.promo, event.placement, event.locale, event.variant],
      doubles: [1],
      indexes: [PROMO_NAME],
    });
  } catch (error) {
    console.error('[promo] the event could not be recorded', error);
  }
  return empty(204);
};
