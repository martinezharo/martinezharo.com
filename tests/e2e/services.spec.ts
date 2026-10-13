import { expect, test } from '@playwright/test';

test('every page leads to the services page instead of a bare address', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await expect(page.locator('.side nav').getByRole('link', { name: 'Services', exact: true })).toHaveAttribute('href', '/services');
  await expect(page.locator('.side-foot').getByRole('link')).toHaveAttribute('href', '/services');
  await expect(page.locator('footer .invitation a')).toHaveAttribute('href', '/services#contact');
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);

  await page.goto('/es/stack');
  await expect(page.locator('footer .invitation a')).toHaveAttribute('href', '/es/services#contact');

  await page.goto('/services');
  await expect(page.locator('.side nav a[aria-current="page"]')).toHaveText('Services');
  // On the page itself the invitation points down the page, not back to it.
  await expect(page.locator('footer .invitation a')).toHaveAttribute('href', '#contact');
});

test('lists the services as posters, with indicative prices and what my projects would cost', async ({ page }) => {
  await page.goto('/es/services');

  const posters = page.locator('.poster');
  await expect(posters).toHaveCount(3);
  await expect(posters.locator('h2')).toHaveText(['Aplicación web', 'Landing page', 'Rediseño']);
  await expect(posters.locator('.poster-tiers li')).toHaveCount(9);
  await expect(page.locator('.posters-note')).toContainText('orientativos');

  // Only quoted projects the portfolio actually renders, dearest first.
  const bars = page.locator('.chart-bars a');
  await expect(bars.locator('.chart-name')).toHaveText(['Fewya', 'Rankmaker']);
  await expect(bars.first()).toHaveAttribute('href', '/es/projects/fewya');
});

test("a poster's button brings its service down to the form", async ({ page }) => {
  await page.goto('/services');
  await page.locator('.poster[data-service="redesign"] .poster-ask').click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('[data-contact] [name=service][value=redesign]')).toBeChecked();
});

test('sends the contact form through the API', async ({ page }) => {
  await page.goto('/services');
  const form = page.locator('[data-contact]');

  await form.getByRole('radio', { name: 'Landing page' }).check({ force: true });
  await form.getByLabel('Name').fill('Ada');
  await form.getByLabel('Email').fill('ada@example.com');
  await form.getByLabel('Your project').fill('A landing page for a small bakery.');

  // The button waits for Turnstile's (test) token.
  const submit = form.getByRole('button', { name: /Send/ });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  await submit.click();

  await expect(form.locator('[data-status]')).toHaveAttribute('data-tone', 'success');
  await expect(form.getByLabel('Name')).toHaveValue('');
});

test('the contact API refuses incomplete and unchecked messages', async ({ request, baseURL }) => {
  const headers = { Origin: baseURL! };
  const invalid = await request.post('/api/contact', {
    headers,
    multipart: { name: '', email: 'not-an-email', service: 'webApp', message: 'short' },
  });
  expect(invalid.status()).toBe(400);
  expect(await invalid.json()).toEqual({ ok: false, error: 'invalid' });

  const unchecked = await request.post('/api/contact', {
    headers,
    multipart: { name: 'Ada', email: 'ada@example.com', service: 'webApp', message: 'A web app for my shop.' },
  });
  expect(unchecked.status()).toBe(403);
  expect(await unchecked.json()).toEqual({ ok: false, error: 'challenge' });

  // Whatever fills the hidden field is told it worked, and nothing is checked or sent.
  const trapped = await request.post('/api/contact', {
    headers,
    multipart: { name: 'Bot', email: 'bot@example.com', service: 'other', message: 'Buy cheap things now', website: 'x' },
  });
  expect(trapped.status()).toBe(200);
});
