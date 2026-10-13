# Hire page and contact form

`/hire` (and `/es/hire`) lists the services, their indicative prices, what the
portfolio's own projects would cost, and a contact form. The rail, the mobile
header and the footer link to it; the email address now lives only on that
page, in the Markdown documents and in the structured data.

## Prices

`src/features/hire/model.ts` holds every figure:

- `SERVICES`: the web app and redesign packages mirror the Fiverr gigs of the
  same name; the landing page packages have no gig behind them. Prices are in
  US dollars because Fiverr quotes them in that currency.
- `PROJECT_QUOTES`: the price and duration band each project carries on the
  Fiverr portfolio, keyed by the project's slug. A slug missing from the
  database drops out of the list.

The words for each service and package live in `src/i18n/index.ts` under `hire`.

## Contact form

The form posts to `/api/contact`, which validates the fields, checks the
Turnstile token, and sends the message to `site.email` from
`contact@martinezharo.com` through the `EMAIL` binding, with the sender as
reply-to. A hidden honeypot field is accepted and discarded.

The form only renders when `TURNSTILE_SITE_KEY` is set; until then the section
offers the address instead. To turn it on:

1. **Email Sending.** In the Cloudflare dashboard, open Compute > Email Service >
   Email Sending and onboard `martinezharo.com`. This adds the `cf-bounce`
   records (MX, SPF, DKIM, DMARC) next to the existing Email Routing ones.
2. **Turnstile.** Create a widget for `martinezharo.com` (managed mode is
   fine; the form renders it with `appearance: interaction-only`). Put the site
   key in `vars.TURNSTILE_SITE_KEY` in `wrangler.jsonc`, and store the secret:

   ```sh
   pnpm exec wrangler secret put TURNSTILE_SECRET_KEY
   ```

   Preview URLs use a different hostname; add it to the widget's hostnames if
   the form should work there too.
3. Deploy, then send a test message from the page.

If the secret is missing every message is refused with `challenge`; if the
binding cannot send, the form answers `unavailable` and points at the address.

## Tests

The E2E server uses Cloudflare's published always-pass Turnstile test keys and
local email simulation (Wrangler logs the message instead of sending it). The
token check calls Cloudflare's `siteverify` endpoint, so the contact test needs
network access.
