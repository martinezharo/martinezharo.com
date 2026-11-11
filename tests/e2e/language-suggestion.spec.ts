import { expect, test } from '@playwright/test';

test('offers English on a Spanish search landing and remembers the switch', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-GB' });
  const page = await context.newPage();
  await page.goto('/es/projects/fewya?source=search#story');
  const note = page.locator('language-suggestion');
  await expect(note).toBeVisible();
  await expect(note.getByRole('link')).toHaveAttribute('href', /\/projects\/fewya\?source=search&lang=en#story$/);
  await note.getByRole('link', { name: 'Switch to English' }).click();
  await expect(page).toHaveURL(/\/projects\/fewya\?source=search#story$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto('/es');
  await expect(note).toBeHidden();
  await context.close();
});

test('dismissal survives client navigation and reloads', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-GB' });
  const page = await context.newPage();
  await page.goto('/es');
  const note = page.locator('language-suggestion');
  await expect(note).toBeVisible();
  await note.getByRole('button', { name: 'Dismiss language suggestion' }).click();
  await expect(note).toBeHidden();
  await page.locator('a[href="/es/stack"]').first().click();
  await expect(page).toHaveURL(/\/es\/stack$/);
  await expect(note).toBeHidden();
  await page.reload();
  await expect(note).toBeHidden();
  await context.close();
});

test('stays quiet for matching languages and manually chosen languages', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-GB' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('language-suggestion')).toBeHidden();
  await page.getByRole('navigation', { name: 'Language' }).getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator('language-suggestion')).toBeHidden();
  await context.close();
});

test('offers Spanish on an English deep link on mobile with reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-ES', viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/stack');
  const note = page.locator('language-suggestion');
  await expect(note.getByRole('link', { name: 'Cambiar a español' })).toBeVisible();
  expect(await note.locator('aside').evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  const bounds = (await note.boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(375);
  const badge = (await page.locator('.gh-badge').boundingBox())!;
  const clear = bounds.x + bounds.width <= badge.x || bounds.y + bounds.height <= badge.y;
  expect(clear).toBe(true);
  await note.getByRole('link').click();
  await expect(page).toHaveURL(/\/es\/stack$/);
  await context.close();
});

test('offers the language the browser asks for, not just any other', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'de-DE' });
  const page = await context.newPage();
  await page.goto('/es/stack');
  const note = page.locator('language-suggestion');
  await expect(note.getByRole('link', { name: 'Zu Deutsch wechseln' })).toHaveAttribute('href', /\/de\/stack\?lang=de$/);
  await expect(note.locator('aside')).toHaveCount(1);
  await note.getByRole('link').click();
  await expect(page).toHaveURL(/\/de\/stack$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('language-suggestion')).toBeHidden();
  await context.close();
});

test('stays hidden without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-GB', javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/es');
  await expect(page.locator('language-suggestion')).toBeHidden();
  await context.close();
});
