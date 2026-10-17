import type { ContactService } from './contact';

/**
 * One colour per service, so the three read as three posters on one wall and
 * the form below picks up the colour of whichever one is chosen. The ink is the
 * same hue taken nearly to black, which keeps every line of type on its colour
 * well past 7:1. "Something else" has no poster, so it is plain light grey.
 */
export const paint: Record<ContactService, { bg: string; ink: string }> = {
  webApp: { bg: '#b49bff', ink: '#120b26' },
  landing: { bg: '#ffd84d', ink: '#231a00' },
  redesign: { bg: '#ff8ad0', ink: '#2a0a1e' },
  other: { bg: '#e6e6e6', ink: '#111111' },
};
