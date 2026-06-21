import { test, expect } from '@playwright/test';

test.describe('About page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('page title includes About', async ({ page }) => {
    await expect(page).toHaveTitle(/About/i);
  });

  test('family-run mention is present', async ({ page }) => {
    await expect(page.locator('text=/family/i').first()).toBeVisible();
  });

  test('location Centurion is mentioned', async ({ page }) => {
    await expect(page.locator('text=/Centurion/i').first()).toBeVisible();
  });

  test('values Honesty Commitment Community appear', async ({ page }) => {
    for (const v of ['Honesty', 'Commitment', 'Community']) {
      await expect(page.locator(`text=${v}`).first()).toBeVisible();
    }
  });

  test('CTA section is present', async ({ page }) => {
    const cta = page.locator('a[href="/onboarding"], a[href="/contact"]').first();
    await expect(cta).toBeVisible();
  });
});
