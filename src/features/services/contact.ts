import { env } from 'cloudflare:workers';
import { site } from '../../config/site';
import { SERVICE_KEYS, type ServiceKey } from './model';

/**
 * The contact form's server side: read the fields, check the person is a
 * person, and mail the message to the site's own address with the sender as
 * the reply-to, so answering it is an ordinary reply.
 *
 * It sends through the `EMAIL` binding (Cloudflare Email Service), from an
 * address on this domain, and only to `site.email`. Turnstile stands between
 * the form and the binding; without its secret the endpoint refuses every
 * message rather than relaying unchecked ones. docs/services.md has the setup.
 */

export const LIMITS = { name: 100, email: 254, message: 5000, messageMin: 10 } as const;

export type ContactService = ServiceKey | 'other';
export const CONTACT_SERVICES: readonly ContactService[] = [...SERVICE_KEYS, 'other'];

/** What the form can be told went wrong. The page owns the words for each. */
export type ContactError = 'invalid' | 'challenge' | 'unavailable';

export interface ContactMessage {
  name: string;
  email: string;
  service: ContactService;
  message: string;
}

const SENDER = { email: 'contact@martinezharo.com', name: 'martinezharo.com' };
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

interface ContactEnv {
  EMAIL?: SendEmail;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const contactEnv = env as unknown as ContactEnv;

/** The public half of the Turnstile pair. No key, no form: the page offers the address instead. */
export function turnstileSiteKey(): string | null {
  return contactEnv.TURNSTILE_SITE_KEY || null;
}

function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

/** The message the form describes, or null when any field is missing or out of bounds. */
export function parseContact(form: FormData): ContactMessage | null {
  const name = field(form, 'name');
  const email = field(form, 'email');
  const service = field(form, 'service');
  const message = field(form, 'message');

  if (!name || name.length > LIMITS.name) return null;
  if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) return null;
  if (!CONTACT_SERVICES.includes(service as ContactService)) return null;
  if (message.length < LIMITS.messageMin || message.length > LIMITS.message) return null;

  return { name, email, service: service as ContactService, message };
}

export async function verifyHuman(token: string, ip: string | null): Promise<boolean> {
  const secret = contactEnv.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;

  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);

  try {
    const response = await fetch(SITEVERIFY, { method: 'POST', body });
    const outcome = await response.json<{ success?: boolean }>();
    return outcome.success === true;
  } catch {
    return false;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`);
}

export async function sendContact(contact: ContactMessage, locale: string): Promise<boolean> {
  if (!contactEnv.EMAIL) return false;

  const lines = [
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Service: ${contact.service}`,
    `Language: ${locale}`,
  ];

  try {
    await contactEnv.EMAIL.send({
      to: site.email,
      from: SENDER,
      replyTo: contact.email,
      subject: `New enquiry (${contact.service}) from ${contact.name}`,
      text: `${lines.join('\n')}\n\n${contact.message}\n`,
      html: `<p>${lines.map(escapeHtml).join('<br>')}</p><p style="white-space:pre-wrap">${escapeHtml(contact.message)}</p>`,
    });
    return true;
  } catch (error) {
    console.error('[contact] the message could not be sent', error);
    return false;
  }
}
