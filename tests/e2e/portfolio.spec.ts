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
  await expect(kenobismo).toHaveAttribute('data-overall', '53');
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
