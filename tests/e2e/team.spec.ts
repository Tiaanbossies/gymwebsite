import { test, expect } from '@playwright/test';

test.describe('Team page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/team');
  });

  test('page title includes Team', async ({ page }) => {
    await expect(page).toHaveTitle(/Team/i);
  });

  test('owner Johan Boshoff is listed', async ({ page }) => {
    await expect(page.locator('text=/Johan/').first()).toBeVisible();
  });

  test('family members Rene or Debbie appear', async ({ page }) => {
    const rene = page.locator('text=/Rene/');
    const debbie = page.locator('text=/Debbie/');
    const either = (await rene.count()) > 0 || (await debbie.count()) > 0;
    expect(either).toBeTruthy();
  });

  test('/community route also renders team page', async ({ page }) => {
    await page.goto('/community');
    await expect(page.locator('text=/Johan/').first()).toBeVisible();
  });

  test('CTA section is present', async ({ page }) => {
    const cta = page.locator('a[href="/onboarding"], a[href="/contact"]').first();
    await expect(cta).toBeVisible();
  });
});
