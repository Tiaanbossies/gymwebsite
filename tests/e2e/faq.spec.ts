import { test, expect } from '@playwright/test';

test.describe('FAQ page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/faq');
  });

  test('page title includes FAQ', async ({ page }) => {
    await expect(page).toHaveTitle(/FAQ/i);
  });

  test('free trial question is present', async ({ page }) => {
    await expect(page.locator('text=/free trial/i').first()).toBeVisible();
  });

  test('joining fee question is present', async ({ page }) => {
    await expect(page.locator('text=/joining fee/i').first()).toBeVisible();
  });

  test('accordion item expands on click', async ({ page }) => {
    // Each accordion group starts with index 0 open, so nth(1) is closed.
    // DOM order is stable — clicking nth(1) sets its aria-expanded to true.
    const buttons = page.locator('button[aria-expanded]');
    const target = buttons.nth(1);
    await expect(target).toHaveAttribute('aria-expanded', 'false');
    await target.click();
    await page.waitForTimeout(400);
    await expect(target).toHaveAttribute('aria-expanded', 'true');
  });

  test('CTA section is present', async ({ page }) => {
    const cta = page.locator('a[href="/onboarding"], a[href="/contact"]').first();
    await expect(cta).toBeVisible();
  });
});
