import { test, expect } from '@playwright/test';

// These run in the mobile-chrome project (Pixel 5 viewport)
test.describe('Mobile responsiveness', () => {
  test('homepage renders without horizontal scroll', async ({ page }) => {
    await page.goto('/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()!.width;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });

  test('mobile nav opens and shows links', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator(
      'button[aria-label*="menu" i], button[aria-label*="nav" i], [data-testid="mobile-menu"], button:has(svg)'
    ).first();
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(300);
      await expect(page.locator('a[href="/services"]').first()).toBeVisible();
    } else {
      await expect(page.locator('a[href="/services"]').first()).toBeAttached();
    }
  });

  test('contact page phone number is a tel: link', async ({ page }) => {
    await page.goto('/contact');
    const telLink = page.locator('a[href^="tel:"]').first();
    await expect(telLink).toBeVisible();
  });

  test('WhatsApp CTA is tappable on mobile', async ({ page }) => {
    await page.goto('/');
    const wa = page.locator('a[href*="wa.me"]').first();
    await expect(wa).toBeVisible();
  });

  test('pricing page does not overflow on mobile', async ({ page }) => {
    await page.goto('/pricing');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()!.width;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });
});
