import { test, expect } from '@playwright/test';

test.describe('Membership page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/membership');
  });

  test('page title includes Membership', async ({ page }) => {
    await expect(page).toHaveTitle(/Membership/i);
  });

  test('membership options are shown', async ({ page }) => {
    await expect(page.locator('text=/month-to-month/i').first()).toBeVisible();
  });

  test('free trial mention is present', async ({ page }) => {
    await expect(page.locator('text=/free trial/i').first()).toBeVisible();
  });

  test('student or pensioner discount mention is present', async ({ page }) => {
    await expect(page.locator('text=/student/i').first()).toBeVisible();
  });

  test('comparison table or grid renders', async ({ page }) => {
    const table = page.locator('table, [role="table"], .grid').first();
    await expect(table).toBeVisible();
  });

  test('join CTA links to onboarding', async ({ page }) => {
    const joinLink = page.locator('a[href="/onboarding"], a[href="/join"]').first();
    await expect(joinLink).toBeVisible();
  });
});
