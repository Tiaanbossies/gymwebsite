import { test, expect } from '@playwright/test';

test.describe('Services page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services');
  });

  test('page title includes Services', async ({ page }) => {
    await expect(page).toHaveTitle(/Services/i);
  });

  test('personal training service is listed', async ({ page }) => {
    await expect(page.locator('text=/personal training/i').first()).toBeVisible();
  });

  test('open gym service is listed', async ({ page }) => {
    await expect(page.locator('text=/open gym/i').first()).toBeVisible();
  });

  test('nutrition service is listed', async ({ page }) => {
    await expect(page.locator('text=/nutrition/i').first()).toBeVisible();
  });

  test('body assessment service is listed', async ({ page }) => {
    await expect(page.locator('text=/assessment/i').first()).toBeVisible();
  });

  test('CTA to join or contact is present', async ({ page }) => {
    const cta = page.locator('a[href="/onboarding"], a[href="/contact"], a[href*="trial"]');
    await expect(cta.first()).toBeVisible();
  });

  test('page has breadcrumb with Home link', async ({ page }) => {
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
  });
});
