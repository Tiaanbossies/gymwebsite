import { test, expect } from '@playwright/test';

const ROUTES = [
  { path: '/',           titlePattern: /Bossie's Gym/i },
  { path: '/services',   titlePattern: /Services/i },
  { path: '/membership', titlePattern: /Membership/i },
  { path: '/pricing',    titlePattern: /Pricing/i },
  { path: '/team',       titlePattern: /Team/i },
  { path: '/gallery',    titlePattern: /Gallery/i },
  { path: '/about',      titlePattern: /About/i },
  { path: '/contact',    titlePattern: /Contact/i },
  { path: '/faq',        titlePattern: /FAQ/i },
];

test.describe('SEO meta tags', () => {
  for (const { path, titlePattern } of ROUTES) {
    test(`${path} — correct page title`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(titlePattern);
    });

    test(`${path} — description meta tag`, async ({ page }) => {
      await page.goto(path);
      const desc = await page.getAttribute('meta[name="description"]', 'content');
      expect(desc).toBeTruthy();
      expect(desc!.length).toBeGreaterThan(20);
    });

    test(`${path} — canonical link tag`, async ({ page }) => {
      await page.goto(path);
      const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(canonical).toBeTruthy();
      expect(canonical).toContain('bossiesgym.co.za');
    });

    test(`${path} — og:title meta tag`, async ({ page }) => {
      await page.goto(path);
      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      expect(ogTitle).toBeTruthy();
    });
  }
});
