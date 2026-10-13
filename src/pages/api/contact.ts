import type { APIRoute } from 'astro';
import { parseContact, sendContact, verifyHuman, type ContactError } from '../../features/services/contact';
import { isLocale } from '../../i18n';

function reply(status: number, error?: ContactError): Response {
  return Response.json(error ? { ok: false, error } : { ok: true }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(400, 'invalid');
  }

  // A field no person can see. Whatever fills it is told the message went
  // through, so it has no reason to try again with a different shape.
  if (form.get('website')) return reply(200);

  const contact = parseContact(form);
  if (!contact) return reply(400, 'invalid');

  const token = form.get('cf-turnstile-response');
  const human = await verifyHuman(typeof token === 'string' ? token : '', request.headers.get('CF-Connecting-IP'));
  if (!human) return reply(403, 'challenge');

  const locale = form.get('locale');
  const sent = await sendContact(contact, typeof locale === 'string' && isLocale(locale) ? locale : 'en');
  return sent ? reply(200) : reply(502, 'unavailable');
};
