/**
 * The promo funnel's shared vocabulary: the services page is promoted from
 * the author's other sites (RANKMAKER, Backrooms), and each step a visitor
 * takes after the click is counted once into the `promo_events` dataset the
 * private promo-stats dashboard reads. The page script is `client.ts`, the
 * endpoint `src/pages/api/promo-event.ts`.
 *
 * Imported by both the browser and the Worker, so nothing here touches either.
 */

/** The one thing promoted on this site. */
export const PROMO_NAME = 'services';

export const PROMO_SOURCES = ['rankmaker', 'backrooms'] as const;
export type PromoSource = (typeof PROMO_SOURCES)[number];

export const PROMO_EVENTS = ['arrive', 'stay-10s', 'stay-1m', 'stay-3m', 'contact'] as const;
export type PromoEventName = (typeof PROMO_EVENTS)[number];

/** Placements and wordings: short lowercase ids. */
export const PROMO_ID = /^[a-z0-9][a-z0-9-]{0,31}$/;
/** The two-letter language of the page the promo was shown on. */
export const PROMO_LOCALE = /^[a-z]{2}$/;

/** An attribution lives this long after the click; past it, nothing is reported. */
export const PROMO_ATTRIBUTION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** What the page reports for each step, and all the endpoint accepts. */
export interface PromoEvent {
  event: PromoEventName;
  promo: typeof PROMO_NAME;
  source: PromoSource;
  placement: string;
  locale: string;
  variant: string;
}

/** The promo a visitor came from, as it travels with a contact message. */
export interface PromoOrigin {
  source: PromoSource;
  placement: string;
  locale: string;
  variant: string;
  /** How long before the message the visitor arrived, in seconds. */
  ageSeconds: number;
}

export function isPromoSource(value: unknown): value is PromoSource {
  return typeof value === 'string' && (PROMO_SOURCES as readonly string[]).includes(value);
}

export function isPromoEventName(value: unknown): value is PromoEventName {
  return typeof value === 'string' && (PROMO_EVENTS as readonly string[]).includes(value);
}

export function isPromoId(value: unknown): value is string {
  return typeof value === 'string' && PROMO_ID.test(value);
}

/** A wording is optional: empty means the promo was not tested with several. */
export function isPromoVariant(value: unknown): value is string {
  return value === '' || isPromoId(value);
}

export function isPromoLocale(value: unknown): value is string {
  return typeof value === 'string' && PROMO_LOCALE.test(value);
}

/** A reported step, or null when anything about it is off. Extra keys are ignored. */
export function parsePromoEvent(value: unknown): PromoEvent | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return null;
  const { event, promo, source, placement, locale, variant } = value as Record<string, unknown>;
  if (!isPromoEventName(event) || promo !== PROMO_NAME || !isPromoSource(source)) return null;
  if (!isPromoId(placement) || !isPromoLocale(locale) || !isPromoVariant(variant)) return null;
  return { event, promo, source, placement, locale, variant };
}

/** The contact form's fields for the promo a visitor came from. */
export const PROMO_FIELDS = {
  source: 'promo_source',
  placement: 'promo_placement',
  locale: 'promo_locale',
  variant: 'promo_variant',
  age: 'promo_age',
} as const;

/**
 * The promo a contact message says its sender came from, or null when it says
 * none or anything about it is off. Never a reason to refuse the message.
 */
export function parsePromoOrigin(get: (name: string) => unknown): PromoOrigin | null {
  const source = get(PROMO_FIELDS.source);
  const placement = get(PROMO_FIELDS.placement);
  const locale = get(PROMO_FIELDS.locale);
  const variant = get(PROMO_FIELDS.variant) ?? '';
  const age = get(PROMO_FIELDS.age);
  if (!isPromoSource(source) || !isPromoId(placement) || !isPromoLocale(locale) || !isPromoVariant(variant)) {
    return null;
  }
  if (typeof age !== 'string' || !/^\d{1,7}$/.test(age)) return null;
  const ageSeconds = Number(age);
  if (ageSeconds * 1000 > PROMO_ATTRIBUTION_TTL_MS) return null;
  return { source, placement, locale, variant, ageSeconds };
}

const SOURCE_NAMES: Record<PromoSource, string> = { rankmaker: 'RANKMAKER', backrooms: 'Backrooms' };

function ago(seconds: number): string {
  const units: ReadonlyArray<readonly [number, string]> = [
    [86_400, 'day'],
    [3_600, 'hour'],
    [60, 'minute'],
  ];
  for (const [size, unit] of units) {
    const count = Math.floor(seconds / size);
    if (count >= 1) return `${count} ${unit}${count === 1 ? '' : 's'} ago`;
  }
  return 'just now';
}

/** One line for the author: "RANKMAKER (es) · results · wording your-ad-here · 2 days ago". */
export function describePromoOrigin(origin: PromoOrigin): string {
  return [
    `${SOURCE_NAMES[origin.source]} (${origin.locale})`,
    origin.placement,
    ...(origin.variant ? [`wording ${origin.variant}`] : []),
    ago(origin.ageSeconds),
  ].join(' · ');
}
