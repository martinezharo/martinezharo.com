import { expect, test } from '@playwright/test';

test('filters and sorts the project list', async ({ page }) => {
  await page.goto('/');

  const projects = page.locator('[data-item]');
  await expect(page.locator('[data-work]')).toHaveAttribute('data-ready', 'true');
  const total = await projects.count();
  const active = await page.locator('[data-item][data-active="true"]').count();
  expect(total).toBeGreaterThan(0);
  expect(active).toBeGreaterThan(0);
  await expect(page.locator('[data-item]:visible')).toHaveCount(total);
  await expect(page.locator('[data-work]')).toHaveAttribute('data-state-field', 'default');

  // Default favours projects with more applicable metrics. Within each group,
  // the completeness-adjusted overall score decides the order.
  const defaultRanks = await projects.evaluateAll((items) =>
    items.map((item) => {
      const data = (item as HTMLElement).dataset;
      return {
        name: data.name ?? '',
        rated: Number(data.ratedCount),
        overall: data.overall === undefined ? null : Number(data.overall),
      };
    }),
  );
  expect(defaultRanks).toEqual(
    [...defaultRanks].sort(
      (left, right) =>
        right.rated - left.rated ||
        (right.overall ?? 0) - (left.overall ?? 0) ||
        left.name.localeCompare(right.name, 'en'),
    ),
  );

  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Status/ }).click();
  await page.getByRole('menuitemradio', { name: /^Active/ }).click();

  await expect(page.locator('[data-item]:visible')).toHaveCount(active);
  await expect(page.locator('[data-announce]')).toHaveText(
    `Showing ${active} of ${total} projects, status is active.`,
  );
  await expect(page.locator('[data-chip="status"]')).toBeVisible();

  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Order/ }).click();
  await expect(page.getByRole('menuitemradio', { name: 'Default' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await page.getByRole('menuitemradio', { name: 'Name' }).click();

  await expect(page.locator('[data-work]')).toHaveAttribute('data-state-dir', 'asc');
  // Reordering keeps the count, so the order clause is what makes it audible.
  await expect(page.locator('[data-announce]')).toHaveText(
    `Showing ${active} of ${total} projects, status is active, sorted by name, a to z.`,
  );
  const names = await page.locator('[data-item]:visible .project-name').allTextContents();
  expect(names).toEqual([...names].sort((left, right) => left.localeCompare(right, 'en')));
});

test('keeps a project off a scale that does not apply to it', async ({ page }) => {
  await page.goto('/');

  // Kenobismo is a brand with no interface of its own, so it carries no design.
  const kenobismo = page.locator('[data-item]').filter({ hasText: 'Kenobismo' });
  const design = kenobismo.locator('.rating[data-metric="design"]');

  await expect(design.locator('.meter')).toHaveClass(/is-void/);
  await expect(design.getByLabel('Design: does not apply')).toBeAttached();
  // Unrated metrics count as zero in the average rather than being left out of
  // it. The other scores are live database content, so derive the answer from
  // the row instead of pinning the test to today's values.
  const scores = await kenobismo.evaluate((item) =>
    ['design', 'engineering', 'impact', 'maturity'].map((metric) =>
      Number((item as HTMLElement).dataset[metric] ?? 0),
    ),
  );
  const overall = Number(await kenobismo.getAttribute('data-overall'));
  expect(overall).toBe(scores.reduce((total, score) => total + score, 0) / scores.length);
  await expect(kenobismo).not.toHaveAttribute('data-design');

  // More than one project can be off a scale, so this asks where an unrated
  // project sits rather than naming the one that happens to sort last.
  const items = page.locator('[data-item]:visible');

  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Order/ }).click();
  await page.getByRole('menuitemradio', { name: 'Design' }).click();
  await expect(items.last()).not.toHaveAttribute('data-design');

  // Turning the order round must not promote "does not apply" to "the best".
  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Direction/ }).click();
  await page.getByRole('menuitemradio', { name: 'Lowest first' }).click();
  await expect(items.first()).toHaveAttribute('data-design');
  await expect(items.last()).not.toHaveAttribute('data-design');
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
    'Design',
    'Engineering',
    'Impact',
    'Maturity',
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

test('links every stack tool to its official website', async ({ page }) => {
  await page.goto('/stack');

  const tools = page.locator('.stack-tool');
  await expect(tools).toHaveCount(21);

  for (const tool of await tools.all()) {
    await expect(tool).toHaveAttribute('href', /^https:\/\//);
    await expect(tool).toHaveAttribute('target', '_blank');
    await expect(tool).toHaveAttribute('rel', 'noopener noreferrer');
  }

  await expect(page.getByRole('link', { name: /official Astro website/ })).toHaveAttribute(
    'href',
    'https://astro.build/',
  );
});

// The row's shape follows the column it is drawn in, not the screen: the rail
// takes a fixed 280px, so a 900px window leaves the list less room than a phone
// in landscape and the row has to fold there too. `display: contents` is what
// the folded row does to the copy block, whose parts become lines of the row.
test('folds the project rows while the rail leaves the column narrow', async ({ page }) => {
  const shape = () =>
    page.locator('.project-copy').first().evaluate((copy) => getComputedStyle(copy).display);

  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/');

  await expect(page.locator('.side')).toBeVisible();
  expect(await shape()).toBe('contents');

  await page.setViewportSize({ width: 1600, height: 900 });
  expect(await shape()).toBe('grid');
});

// Everything drawn in that column answers the same question, so the header and
// the footer fold with the rows rather than at their own width.
test('folds the rest of the column with the rows', async ({ page }) => {
  const display = (selector: string) =>
    page.locator(selector).evaluate((el) => getComputedStyle(el).display);

  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/');

  expect(await display('.section-head')).toBe('grid');
  expect(await display('footer')).toBe('grid');

  await page.setViewportSize({ width: 1600, height: 900 });
  expect(await display('.section-head')).toBe('flex');
  expect(await display('footer')).toBe('flex');
});

// The same question on a project page, where the story sets a 680px measure the
// row keeps to — until the column is narrower than the measure, and holding it
// would only crop the row.
test('lets the next-project row take the whole column once it is narrow', async ({ page }) => {
  const measure = () =>
    page.locator('.next-link').evaluate((link) => getComputedStyle(link).maxWidth);

  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/projects/fewya');

  await expect(page.locator('.project-rail')).toBeVisible();
  expect(await measure()).toBe('none');

  await page.setViewportSize({ width: 1600, height: 900 });
  expect(await measure()).toBe('680px');
});

test('keeps the list working after a round trip to a project', async ({ page }) => {
  await page.goto('/');
  const active = await page.locator('[data-item][data-active="true"]').count();

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

  await expect(page.locator('[data-item]:visible')).toHaveCount(active);
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

  const total = await page.locator('[data-item]').count();
  const active = await page.locator('[data-item][data-active="true"]').count();

  await page.getByRole('button', { name: 'Filtrar y ordenar' }).click();
  await page.getByRole('menuitem', { name: /^Estado/ }).click();
  await page.getByRole('menuitemradio', { name: /^Activo/ }).click();
  await expect(page.locator('[data-announce]')).toHaveText(
    `Mostrando ${active} de ${total} proyectos, estado: activo.`,
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

test('honours the switch out of Spanish on the page that negotiates', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-ES' });
  const page = await context.newPage();

  await page.goto('/');
  await expect(page).toHaveURL(/\/es$/);

  // The root is the one address that reads the browser's header, so asking for
  // English there has to outrank it — otherwise the switch bounces straight
  // back and looks broken.
  await page.getByRole('link', { name: 'Idioma' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  // And the choice sticks: coming back to the root does not undo it.
  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await context.close();
});

test('carries the order you chose into the link on to the next project', async ({ page }) => {
  await page.goto('/');

  const rows = page.locator('[data-item]:visible');
  const names = rows.locator('.project-name');
  const next = page.locator('.next');
  const list = page.locator('[data-work]');

  // The first pass moves the rows into place, and a row clicked while it is
  // being moved swallows the click.
  await expect(list).toHaveAttribute('data-ready', 'true');

  // What follows the first project is simply the second row, whichever order
  // the list happens to be in — so this asks the list rather than naming a
  // project the database could rename tomorrow.
  const second = await names.nth(1).textContent();
  await rows.first().locator('a.project').click();
  await expect(next.locator('.next-name')).toHaveText(second ?? '');

  // The same question under an order the visitor chose. The list forgets it on
  // the way back, so the sort is applied again on the return leg.
  await page.goBack();
  await expect(list).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Order/ }).click();
  await page.getByRole('menuitemradio', { name: 'Name' }).click();
  await expect(list).toHaveAttribute('data-state-dir', 'asc');

  const secondByName = await names.nth(1).textContent();
  await rows.first().locator('a.project').click();
  await expect(next.locator('.next-name')).toHaveText(secondByName ?? '');

  // Nothing follows the last one, and the rail keeps the way back to the list.
  await page.goBack();
  await expect(list).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Order/ }).click();
  await page.getByRole('menuitemradio', { name: 'Name' }).click();
  await expect(list).toHaveAttribute('data-state-dir', 'asc');
  await rows.last().locator('a.project').click();
  await expect(next).toBeHidden();
  await expect(page.getByRole('link', { name: 'Every project' })).toBeVisible();
});

test('falls back to the list\'s own order when your filter leaves the project out', async ({ page }) => {
  await page.goto('/');

  // The list as it arrives, which is the order it starts in.
  await expect(page.locator('[data-work]')).toHaveAttribute('data-ready', 'true');

  const order = await page.locator('[data-item]').evaluateAll((items) =>
    items.map((item) => ({
      archived: (item as HTMLElement).dataset.active !== 'true',
      name: item.querySelector('.project-name')?.textContent ?? '',
      href: item.querySelector('a')?.getAttribute('href') ?? '',
    })),
  );

  // An archived project with something after it: the filter below will leave
  // it off the list it is supposed to be part of, and there is still a right
  // answer to give.
  const index = order.findIndex((project, at) => project.archived && at < order.length - 1);
  expect(index, 'the portfolio needs an archived project that is not the last one').toBeGreaterThanOrEqual(0);

  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Status/ }).click();
  await page.getByRole('menuitemradio', { name: /^Active/ }).click();
  const active = order.filter((project) => !project.archived).length;
  await expect(page.locator('[data-item]:visible')).toHaveCount(active);

  // Rather than take the way on away over a filter set on another page, the
  // page answers for the order the list starts in.
  await page.goto(order[index].href);
  await expect(page.locator('.next')).toBeVisible();
  await expect(page.locator('.next-name')).toHaveText(order[index + 1].name);
});
