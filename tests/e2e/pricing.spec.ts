import { test, expect } from '@playwright/test';

test.describe('Pricing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('page title includes Pricing', async ({ page }) => {
    await expect(page).toHaveTitle(/Pricing/i);
  });

  test('day pass price R100 is displayed', async ({ page }) => {
    await expect(page.locator('text=/R100/').first()).toBeVisible();
  });

  test('open gym month-to-month R450 is displayed', async ({ page }) => {
    await expect(page.locator('text=/R450/').first()).toBeVisible();
  });

  test('open gym 12-month R360 is displayed', async ({ page }) => {
    await expect(page.locator('text=/R360/').first()).toBeVisible();
  });

  test('personal training price R2100 is displayed', async ({ page }) => {
    await expect(page.locator('text=/R2[,\\s]?100/').first()).toBeVisible();
  });

  test('joining fee R200 is mentioned', async ({ page }) => {
    await expect(page.locator('text=/R200/').first()).toBeVisible();
  });

  test('student membership R250 is mentioned', async ({ page }) => {
    await expect(page.locator('text=/R250/').first()).toBeVisible();
  });

  test('join CTA is present', async ({ page }) => {
    const cta = page.locator('a[href="/onboarding"], a[href="/join"]').first();
    await expect(cta).toBeVisible();
  });
});
