/** The three designs under comparison. The preview bar lists them in this order. */
export const VARIANTS = ['island', 'decode', 'hello'] as const;
export type Variant = (typeof VARIANTS)[number];

/** What a real visitor sees until one design is chosen. */
export const DEFAULT_VARIANT: Variant = 'island';

/** `?notice=<variant>` forces a design on screen, for comparing them on the real page. */
export const NOTICE_QUERY = 'notice';

export const VARIANT_NAMES: Record<Variant, string> = {
  island: 'Island',
  decode: 'Decode',
  hello: 'Hello',
};

export function isVariant(value: string | undefined): value is Variant {
  return (VARIANTS as readonly string[]).includes(value ?? '');
}
