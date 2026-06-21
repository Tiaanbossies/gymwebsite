import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/Bossie's Gym/i);
  });

  test('hero section renders with headline and primary CTA', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    const joinBtn = page.locator('a[href="/onboarding"], a[href="/join"]').first();
    await expect(joinBtn).toBeVisible();
  });

  test('services section is present', async ({ page }) => {
    await expect(page.locator('text=/personal training/i').first()).toBeVisible();
  });

  test('gym name appears in the page', async ({ page }) => {
    await expect(page.locator("text=Bossie's").first()).toBeVisible();
  });

  test('has a CTA section with join or trial action', async ({ page }) => {
    const cta = page.locator('a[href="/onboarding"], a[href*="trial"], a[href*="contact"]');
    await expect(cta.first()).toBeVisible();
  });
});
