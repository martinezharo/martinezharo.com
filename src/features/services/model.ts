/**
 * What can be bought, and what it costs.
 *
 * The web app and the redesign mirror the two Fiverr gigs of the same name,
 * package for package; the landing page has no gig behind it. Prices are in US
 * dollars because that is the currency Fiverr quotes them in, so the two never
 * disagree. Every figure here is a starting point the page calls orientative:
 * the scope a client describes is what sets the real number.
 *
 * Words live in the i18n bundle under the same keys. What is here is only what
 * is the same in either language: the money and the days.
 */

export const CURRENCY = 'USD';

export const SERVICE_KEYS = ['webApp', 'landing', 'redesign'] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const TIER_KEYS = ['basic', 'standard', 'premium'] as const;
export type TierKey = (typeof TIER_KEYS)[number];

export interface ServiceTier {
  key: TierKey;
  price: number;
  /** Delivery, in days. */
  days: number;
  /**
   * Rounds of changes included after the first delivery, or null where the
   * package does not count them.
   */
  revisions: number | null;
}

export interface Service {
  key: ServiceKey;
  tiers: ServiceTier[];
}

const tier = (key: TierKey, price: number, days: number, revisions: number | null = null): ServiceTier => ({
  key,
  price,
  days,
  revisions,
});

export const SERVICES: Service[] = [
  {
    key: 'webApp',
    tiers: [tier('basic', 40, 10, 1), tier('standard', 80, 21, 2), tier('premium', 200, 30, 3)],
  },
  {
    key: 'landing',
    tiers: [tier('basic', 35, 4, 1), tier('standard', 60, 7, 2), tier('premium', 100, 10, 3)],
  },
  {
    key: 'redesign',
    tiers: [tier('basic', 30, 3), tier('standard', 40, 7), tier('premium', 50, 14)],
  },
];

/** How long a project took, in the bands Fiverr's portfolio files them under. */
export type QuoteDuration = 'weeks' | 'months';

export interface ProjectQuote {
  /** The project's slug in the portfolio database. */
  slug: string;
  price: number;
  duration: QuoteDuration;
}

/**
 * What each of my own projects would have cost a client, as stated on the
 * Fiverr portfolio. Keyed by slug so the list can borrow the name, logo and
 * blurb the portfolio already keeps, and a project missing from the database
 * simply drops out of the list.
 */
export const PROJECT_QUOTES: ProjectQuote[] = [
  { slug: 'fewya', price: 500, duration: 'months' },
  { slug: 'rankmaker', price: 250, duration: 'weeks' },
  { slug: 'klipcode', price: 150, duration: 'weeks' },
  { slug: 'sendself', price: 100, duration: 'weeks' },
  { slug: 'oliverp', price: 100, duration: 'weeks' },
  { slug: 'akin', price: 60, duration: 'weeks' },
];

export function formatPrice(price: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(price);
}
