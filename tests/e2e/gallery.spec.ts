import { test, expect } from '@playwright/test';

test.describe('Gallery page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gallery');
  });

  test('page title includes Gallery', async ({ page }) => {
    await expect(page).toHaveTitle(/Gallery/i);
  });

  test('gallery grid or tiles render', async ({ page }) => {
    const grid = page.locator('.grid, [class*="gallery"]').first();
    await expect(grid).toBeVisible();
  });

  test('page hero description is present', async ({ page }) => {
    await expect(page.locator('text=/training/i').first()).toBeVisible();
  });

  test('CTA section is present', async ({ page }) => {
    const cta = page.locator('a[href="/onboarding"], a[href="/contact"], a[href*="trial"]').first();
    await expect(cta).toBeVisible();
  });
});
