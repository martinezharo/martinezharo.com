import { expect, test, type Page } from '@playwright/test';

const ARRIVAL =
  '/services?utm_source=rankmaker&utm_medium=promo&utm_content=results&utm_term=your-ad-here&promo_lang=es&keep=1#contact';

/** Playwright announces itself through `navigator.webdriver`, which the funnel ignores on purpose. */
async function asPerson(page: Page): Promise<Array<Record<string, string>>> {
  await page.addInitScript(() => Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }));
  const events: Array<Record<string, string>> = [];
  await page.route('**/api/promo-event', async (route) => {
    events.push(route.request().postDataJSON());
    await route.fulfill({ status: 204 });
  });
  return events;
}

test('a promo arrival is recorded once, cleaned from the URL and timed while visible', async ({ page }) => {
  const events = await asPerson(page);
  await page.clock.install();
  await page.goto(ARRIVAL);

  await expect.poll(() => events.map((event) => event.event)).toEqual(['arrive']);
  expect(events[0]).toEqual({
    event: 'arrive',
    promo: 'services',
    source: 'rankmaker',
    placement: 'results',
    locale: 'es',
    variant: 'your-ad-here',
  });
  // Only the promo's parameters go; the rest of the address stays.
  await expect(page).toHaveURL(/\/services\?keep=1#contact$/);

  await page.clock.runFor(11_000);
  await expect.poll(() => events.map((event) => event.event)).toEqual(['arrive', 'stay-10s']);

  // The time carries over the page loads of the tab, and nothing is reported twice.
  await page.reload();
  await page.clock.runFor(6_000);
  expect(await page.evaluate(() => Number(sessionStorage.getItem('promo-visible-ms')))).toBeGreaterThanOrEqual(15_000);
  expect(events.map((event) => event.event)).toEqual(['arrive', 'stay-10s']);
});

test('an incomplete promo link and an automated browser are not counted', async ({ page }) => {
  const events: unknown[] = [];
  await page.route('**/api/promo-event', async (route) => {
    events.push(route.request().postDataJSON());
    await route.fulfill({ status: 204 });
  });
  await page.goto(ARRIVAL);
  await expect(page).toHaveURL(/utm_source=rankmaker/);
  expect(await page.evaluate(() => localStorage.getItem('promo-attribution'))).toBeNull();

  const person = await asPerson(page);
  await page.goto('/services?utm_source=elsewhere&utm_medium=promo&utm_content=results');
  expect(await page.evaluate(() => localStorage.getItem('promo-attribution'))).toBeNull();
  expect([...events, ...person]).toEqual([]);
});

test('an attribution older than seven days is dropped', async ({ page }) => {
  const events = await asPerson(page);
  await page.goto('/services');
  await page.evaluate(() => {
    const old = { promo: 'services', source: 'backrooms', placement: 'card', locale: 'en', variant: '', at: Date.now() - 8 * 86_400_000, sent: ['arrive'] };
    localStorage.setItem('promo-attribution', JSON.stringify(old));
    sessionStorage.setItem('promo-visit', '1');
  });
  await page.reload();
  expect(await page.evaluate(() => localStorage.getItem('promo-attribution'))).toBeNull();
  expect(events).toEqual([]);
});

test('a contact message says which promo its sender came from', async ({ page }) => {
  const events = await asPerson(page);
  const sent: string[] = [];
  await page.route('**/api/contact', async (route) => {
    sent.push(route.request().postData() ?? '');
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto(ARRIVAL);

  const form = page.locator('[data-contact]');
  await form.getByLabel('Name').fill('Ada');
  await form.getByLabel('Email').fill('ada@example.com');
  await form.getByLabel('Your project').fill('A landing page for a small bakery.');
  const submit = form.getByRole('button', { name: /Send/ });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  await submit.click();
  await expect(form.locator('[data-status]')).toHaveAttribute('data-tone', 'success');

  expect(sent).toHaveLength(1);
  const field = (name: string) => sent[0].match(new RegExp(`name="${name}"\\r\\n\\r\\n([^\\r]*)`))?.[1];
  expect(field('promo_source')).toBe('rankmaker');
  expect(field('promo_placement')).toBe('results');
  expect(field('promo_locale')).toBe('es');
  expect(field('promo_variant')).toBe('your-ad-here');
  expect(field('promo_age')).toMatch(/^\d+$/);
  await expect.poll(() => events.map((event) => event.event)).toContain('contact');
});

test('the promo endpoint takes only well-formed events from this site', async ({ request, baseURL }) => {
  const event = { event: 'arrive', promo: 'services', source: 'rankmaker', placement: 'results', locale: 'es', variant: '' };
  const post = (data: unknown, headers: Record<string, string> = {}) =>
    request.post('/api/promo-event', {
      headers: { Origin: baseURL!, 'Content-Type': 'application/json', ...headers },
      data: typeof data === 'string' ? data : JSON.stringify(data),
    });

  expect((await post(event)).status()).toBe(204);
  expect((await post({ ...event, variant: 'your-ad-here' })).status()).toBe(204);
  expect((await post(event, { Origin: 'https://example.com' })).status()).toBe(403);
  expect((await post(event, { 'Content-Type': 'text/plain' })).status()).toBe(415);
  expect((await post('{not json')).status()).toBe(400);
  expect((await post({ ...event, event: 'stay-1h' })).status()).toBe(400);
  expect((await post({ ...event, promo: 'other' })).status()).toBe(400);
  expect((await post({ ...event, source: 'elsewhere' })).status()).toBe(400);
  expect((await post({ ...event, placement: 'Results' })).status()).toBe(400);
  expect((await post({ ...event, locale: 'spa' })).status()).toBe(400);
  expect((await post({ ...event, variant: '-x' })).status()).toBe(400);
  expect((await post({ ...event, placement: 'x'.repeat(300) })).status()).toBe(413);
});

test('a contact message with a malformed promo still goes through', async ({ request, baseURL }) => {
  // Cloudflare's always-pass test secret accepts its dummy token.
  const response = await request.post('/api/contact', {
    headers: { Origin: baseURL! },
    multipart: {
      name: 'Ada',
      email: 'ada@example.com',
      service: 'webApp',
      message: 'A web app for my shop.',
      'cf-turnstile-response': 'XXXX.DUMMY.TOKEN.XXXX',
      promo_source: 'elsewhere',
      promo_placement: '<b>results</b>',
      promo_locale: 'es',
      promo_variant: '',
      promo_age: '-1',
    },
  });
  expect(response.status()).toBe(200);
});
