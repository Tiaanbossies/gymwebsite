import { test, expect } from '@playwright/test';

// Desktop nav intentionally omits About and Contact to keep the bar compact
// (see Header.jsx DESKTOP_NAV). About/Contact are accessible via footer and mobile nav.
const DESKTOP_NAV_LINKS = [
  { label: 'Services', path: '/services' },
  { label: 'Membership', path: '/membership' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Team', path: '/team' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'FAQ', path: '/faq' },
];

const ALL_FOOTER_PATHS = [
  '/services', '/membership', '/pricing', '/gallery', '/team',
  '/about', '/faq', '/contact',
];

test.describe('Navigation', () => {
  test('desktop nav links are visible and functional', async ({ page }) => {
    await page.goto('/');
    for (const { label, path } of DESKTOP_NAV_LINKS) {
      const link = page.locator(`nav a:has-text("${label}")`).first();
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(path);
      await page.goBack();
    }
  });

  test('logo link returns to homepage', async ({ page }) => {
    await page.goto('/services');
    await page.locator('a[href="/"]').first().click();
    await expect(page).toHaveURL('/');
  });

  test('skip-to-content link exists', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('a.skip-link, a[href="#main"]').first();
    await expect(skip).toBeAttached();
  });

  test('404 page shown for unknown route', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.getByRole('link', { name: 'Back home' })).toBeVisible();
  });

  test('footer links are present', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    for (const path of ALL_FOOTER_PATHS) {
      await expect(footer.locator(`a[href="${path}"]`)).toBeAttached();
    }
  });

  test('sticky WhatsApp button is visible', async ({ page }) => {
    await page.goto('/');
    const wa = page.locator('a[href*="wa.me"]').first();
    await expect(wa).toBeVisible();
  });
});
