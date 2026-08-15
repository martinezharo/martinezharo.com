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
  await expect(page.locator('[data-count-shown]')).toHaveText('5');
  await expect(page.locator('[data-chip="status"]')).toBeVisible();

  await page.getByRole('button', { name: 'Filter and sort' }).click();
  await page.getByRole('menuitem', { name: /^Order/ }).click();
  await page.getByRole('menuitemradio', { name: 'Name' }).click();

  await expect(page.locator('[data-work]')).toHaveAttribute('data-state-dir', 'asc');
  await expect(page.locator('[data-item]:visible').first().locator('.project-name')).toHaveText('Fewya');
});

test('switches to the compact layout on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.locator('.side')).toBeHidden();
  await expect(page.locator('.mobile-head')).toBeVisible();
  await expect(page.locator('.mobile-intro')).toBeVisible();
});
