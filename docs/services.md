# Services page and contact form

`/services` (and its `/es` and `/de` versions) lists the services, their indicative prices, what the
portfolio's own projects would cost, and a contact form. The rail, the mobile
header and the footer link to it; the email address now lives only on that
page, in the Markdown documents and in the structured data.

## Prices

`src/features/services/model.ts` holds every figure:

- `SERVICES`: the web app and redesign packages mirror the Fiverr gigs of the
  same name; the landing page packages have no gig behind them. Prices are in
  US dollars because Fiverr quotes them in that currency.
- `PROJECT_QUOTES`: the price and duration band each project carries on the
  Fiverr portfolio, keyed by the project's slug. A slug missing from the
  database drops out of the list.

The words for each service and package live in `src/i18n/index.ts` under `servicesPage`.

## Contact form

The form posts to `/api/contact`, which validates the fields, checks the
Turnstile token, and sends the message to `site.email` from
`contact@martinezharo.com` through the `EMAIL` binding, with the sender as
reply-to. A hidden honeypot field is accepted and discarded.

The form only renders when `TURNSTILE_SITE_KEY` is set; emptied, the section
offers the address instead. Current setup:

- **Email Sending** is enabled for `martinezharo.com` (Compute > Email Service >
  Email Sending), with its `cf-bounce` records next to the Email Routing ones.
- **Turnstile** widget "martinezharo.com contact form", managed mode, valid on
  `martinezharo.com` and `olma.workers.dev` (so branch previews work). Its site
  key is `vars.TURNSTILE_SITE_KEY` in `wrangler.jsonc`; its secret is the
  `TURNSTILE_SECRET_KEY` Worker secret.

To rotate the secret while a preview version is the latest upload, use
`wrangler versions secret put TURNSTILE_SECRET_KEY` (plain `secret put` refuses
because it would deploy that preview); the next deploy inherits it.

If the secret is missing every message is refused with `challenge`; if the
binding cannot send, the form answers `unavailable` and points at the address.

## Promo funnel

The page is promoted from RANKMAKER and Backrooms. Their links carry
`utm_source`, `utm_medium=promo`, `utm_content` (placement), an optional
`utm_term` (wording) and `promo_lang`. `src/features/promo/client.ts`, run on
every page load from `BaseLayout.astro`, keeps them for seven days as a
localStorage attribution, removes them from the URL and reports each step once
to `POST /api/promo-event`: `arrive`, `stay-10s`, `stay-1m` and `stay-3m` of
visible time in the arrival tab, and `contact` once the form is sent. The
endpoint writes them to the `promo_events` Analytics Engine dataset through
the `PROMO_ANALYTICS` binding, shared with the other sites of the funnel.

While an attribution is live the form also sends `promo_*` fields, and the
email gets a line like
`Came from a promo: RANKMAKER (es) · results · wording your-ad-here · 2 days ago`.
Malformed fields are left out of the email; they never refuse a message.

## Tests

The E2E server uses Cloudflare's published always-pass Turnstile test keys and
local email simulation (Wrangler logs the message instead of sending it). The
token check calls Cloudflare's `siteverify` endpoint, so the contact test needs
network access.
