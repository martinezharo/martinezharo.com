import { expect, test } from '@playwright/test';

test('filters and sorts the project list', async ({ page }) => {
  await page.goto('/');

  const projects = page.locator('[data-item]');
  await expect(projects).toHaveCount(8);
  await expect(page.locator('[data-item]:visible')).toHaveCount(8);

  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Status/ }).click();
  await page.getByRole('menuitemradio', { name: /^Active/ }).click();

  await expect(page.locator('[data-item]:visible')).toHaveCount(5);
  await expect(page.locator('[data-announce]')).toHaveText(
    'Showing 5 of 8 projects, status is active.',
  );
  await expect(page.locator('[data-chip="status"]')).toBeVisible();

  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Order/ }).click();
  await page.getByRole('menuitemradio', { name: 'Name' }).click();

  await expect(page.locator('[data-work]')).toHaveAttribute('data-state-dir', 'asc');
  // Reordering keeps the count, so the order clause is what makes it audible.
  await expect(page.locator('[data-announce]')).toHaveText(
    'Showing 5 of 8 projects, status is active, sorted by name, a to z.',
  );
  await expect(page.locator('[data-item]:visible').first().locator('.project-name')).toHaveText('Fewya');
});

test('keeps a project off a scale that does not apply to it', async ({ page }) => {
  await page.goto('/');

  // Kenobismo is a brand with no interface of its own, so it carries no craft.
  const kenobismo = page.locator('[data-item]').filter({ hasText: 'Kenobismo' });
  const craft = kenobismo.locator('.rating[data-metric="craft"]');

  await expect(craft.locator('.meter')).toHaveClass(/is-void/);
  await expect(craft.getByLabel('Craft: does not apply')).toBeAttached();
  // The other three still have a scale, and craft is left out of the average
  // rather than counted as a zero.
  await expect(kenobismo.locator('.meter.is-void')).toHaveCount(1);
  await expect(kenobismo).toHaveAttribute('data-overall', '2.67');
  await expect(kenobismo).not.toHaveAttribute('data-craft');

  const names = page.locator('[data-item]:visible .project-name');

  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Order/ }).click();
  await page.getByRole('menuitemradio', { name: 'Craft' }).click();
  await expect(names.last()).toHaveText('Kenobismo');

  // Turning the order round must not promote "does not apply" to "the best".
  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Direction/ }).click();
  await page.getByRole('menuitemradio', { name: 'Lowest first' }).click();
  await expect(names.first()).toHaveText('EliteBara');
  await expect(names.last()).toHaveText('Kenobismo');
});

test('explains the ratings in the legend', async ({ page }) => {
  await page.goto('/');

  const legend = page.getByRole('dialog');
  await expect(legend).toBeHidden();

  // The opener is inert until the client script wires it, so opening at all is
  // what this guards; the panel names every metric the cards draw.
  await page.getByRole('button', { name: 'How the ratings work' }).click();
  await expect(legend).toBeVisible();
  await expect(legend.locator('.legend-name')).toHaveText([
    'Craft',
    'Depth',
    'Utility',
    'Impact',
  ]);

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(legend).toBeHidden();

  await page.getByRole('button', { name: 'How the ratings work' }).click();
  await page.keyboard.press('Escape');
  await expect(legend).toBeHidden();
});

test('switches to the compact layout on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.locator('.side')).toBeHidden();
  await expect(page.locator('.mobile-head')).toBeVisible();
  await expect(page.locator('.mobile-intro')).toBeVisible();
});

test('keeps the list working after a round trip to a project', async ({ page }) => {
  await page.goto('/');

  // The client router swaps the body and keeps the document, so nothing here
  // proves itself on a first load: the list has to survive being swapped out
  // and back. A module script only runs once per document, which is what would
  // leave the controls dead on the return leg.
  await page.locator('[data-item]').first().locator('a.project').click();
  await expect(page.locator('.story')).toBeVisible();

  await page.goBack();
  await expect(page.locator('[data-work]')).toHaveAttribute('data-ready', 'true');

  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Status/ }).click();
  await page.getByRole('menuitemradio', { name: /^Active/ }).click();

  await expect(page.locator('[data-item]:visible')).toHaveCount(5);
});

test('navigates between the list and a project without rebuilding the document', async ({ page }) => {
  await page.goto('/');

  // A marker on the window survives a body swap and dies with a full document
  // load, so it tells the two kinds of navigation apart.
  await page.evaluate(() => ((window as unknown as { kept?: boolean }).kept = true));

  await page.locator('[data-item]').first().locator('a.project').click();
  await expect(page.locator('.story')).toBeVisible();

  expect(await page.evaluate(() => (window as unknown as { kept?: boolean }).kept)).toBe(true);
});

test('serves translated interface and project data at /es', async ({ page }) => {
  await page.goto('/es');

  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Cosas que he construido' })).toBeVisible();
  await expect(page.getByText('Un marketplace especializado en productos nuevos de vendedores profesionales.')).toBeVisible();

  await page.getByRole('button', { name: 'Filtrar y ordenar' }).click();
  await page.getByRole('menuitem', { name: /^Estado/ }).click();
  await page.getByRole('menuitemradio', { name: /^Activo/ }).click();
  await expect(page.locator('[data-announce]')).toHaveText(
    'Mostrando 5 de 8 proyectos, estado: activo.',
  );

  await page.locator('[data-item]').filter({ hasText: 'Fewya' }).locator('a.project').click();
  await expect(page).toHaveURL(/\/es\/projects\/fewya$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Cómo fue' })).toBeVisible();
  await expect(page.getByText(/Antes de empezar con Octopus Control/)).toBeVisible();
});

test('chooses Spanish for an unprefixed visit when the browser prefers it', async ({ browser }) => {
  const context = await browser.newContext({
    locale: 'es-ES',
  });
  const page = await context.newPage();

  await page.goto('/');

  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Cosas que he construido' })).toBeVisible();

  await context.close();
});

test('folds the old /en addresses into their unprefixed twins', async ({ request }) => {
  for (const [from, to] of [
    ['/en', '/'],
    ['/en/', '/'],
    ['/en/projects/fewya', '/projects/fewya'],
  ]) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(301);
    expect(new URL(response.headers().location).pathname, from).toBe(to);
  }
});

test('names one address per language and points each at the other', async ({ page }) => {
  const alternates = async (path: string) => {
    await page.goto(path);
    return {
      canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
      en: await page.locator('link[hreflang="en"]').getAttribute('href'),
      es: await page.locator('link[hreflang="es"]').getAttribute('href'),
      fallback: await page.locator('link[hreflang="x-default"]').getAttribute('href'),
    };
  };

  const english = await alternates('/projects/fewya');
  expect(english.canonical).toMatch(/\/projects\/fewya$/);
  expect(english.fallback).toBe(english.en);

  // Both languages have to agree on the pair, or the annotation is ignored.
  const spanish = await alternates('/es/projects/fewya');
  expect(spanish.canonical).toMatch(/\/es\/projects\/fewya$/);
  expect(spanish.en).toBe(english.en);
  expect(spanish.es).toBe(english.es);
});

test('leaves a chosen address in the language it names', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-ES' });
  const page = await context.newPage();

  // The root guesses, but a project URL was picked deliberately: it stays put
  // so the English version stays reachable at all.
  await page.goto('/projects/fewya');
  await expect(page).toHaveURL(/\/projects\/fewya$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  // The way across is the footer switch, and it lands on the same project.
  await page.getByRole('link', { name: 'Language' }).click();
  await expect(page).toHaveURL(/\/es\/projects\/fewya$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');

  await page.getByRole('link', { name: 'Idioma' }).click();
  await expect(page).toHaveURL(/\/projects\/fewya$/);

  await context.close();
});

test('keeps the negotiated page out of shared caches', async ({ request }) => {
  const root = await request.get('/');
  expect(root.headers()['cache-control']).toBe('private, max-age=60');
  expect(root.headers()['vary']).toContain('Accept-Language');

  // Everything else states its language in the URL, so it is safe to share.
  const project = await request.get('/projects/fewya');
  expect(project.headers()['cache-control']).toBe('public, max-age=60, s-maxage=60');
  expect(project.headers()['vary'] ?? '').not.toContain('Accept-Language');
});
