import { test, expect } from '@playwright/test';

test.describe('Onboarding / Join page', () => {
  for (const route of ['/onboarding', '/join']) {
    test(`${route} renders membership agreement form`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveTitle(/Onboarding|Membership/i);
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });

    test(`${route} has plan selection`, async ({ page }) => {
      await page.goto(route);
      const planOption = page.locator('input[type="radio"], select, [role="radio"]').first();
      await expect(planOption).toBeVisible();
    });

    test(`${route} shows personal training or open gym options`, async ({ page }) => {
      await page.goto(route);
      const pt = page.locator('text=/personal training/i').first();
      const og = page.locator('text=/open gym/i').first();
      const ptVisible = await pt.isVisible();
      const ogVisible = await og.isVisible();
      expect(ptVisible || ogVisible).toBeTruthy();
    });
  }
});
