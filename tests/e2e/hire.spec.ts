import { expect, test } from '@playwright/test';

test('every page leads to the hire page instead of a bare address', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await expect(page.locator('.side nav').getByRole('link', { name: 'Hire', exact: true })).toHaveAttribute('href', '/hire');
  await expect(page.locator('.side-foot').getByRole('link')).toHaveAttribute('href', '/hire');
  await expect(page.locator('footer .invitation a')).toHaveAttribute('href', '/hire#contact');
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);

  await page.goto('/es/stack');
  await expect(page.locator('footer .invitation a')).toHaveAttribute('href', '/es/hire#contact');

  await page.goto('/hire');
  await expect(page.locator('.side nav a[aria-current="page"]')).toHaveText('Hire');
  // On the page itself the invitation points down the page, not back to it.
  await expect(page.locator('footer .invitation a')).toHaveAttribute('href', '#contact');
});

test('lists the services with indicative prices and what my projects would cost', async ({ page }) => {
  await page.goto('/es/hire');

  await expect(page.locator('.service')).toHaveCount(3);
  await expect(page.locator('.tier')).toHaveCount(9);
  await expect(page.locator('.services-note')).toContainText('orientativos');
  await expect(page.locator('.service h3')).toHaveText(['Aplicación web', 'Landing page', 'Rediseño']);

  // Only quoted projects the portfolio actually renders, dearest first.
  const quotes = page.locator('.quote');
  await expect(quotes.locator('.quote-name')).toHaveText(['Fewya', 'Rankmaker']);
  await expect(quotes.first()).toHaveAttribute('href', '/es/projects/fewya');
});

test('sends the contact form through the API', async ({ page }) => {
  await page.goto('/hire');
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
