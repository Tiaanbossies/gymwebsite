import { test, expect } from '@playwright/test';

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('page title includes Contact', async ({ page }) => {
    await expect(page).toHaveTitle(/Contact/i);
  });

  test('phone number 072 482 7922 is shown', async ({ page }) => {
    await expect(page.locator('text=/072 482 7922/').first()).toBeVisible();
  });

  test('address Hennopspark is mentioned', async ({ page }) => {
    await expect(page.locator('text=/Hennopspark/i').first()).toBeVisible();
  });

  test('Edison Crescent is mentioned', async ({ page }) => {
    await expect(page.locator('text=/Edison/i').first()).toBeVisible();
  });

  test('contact form renders with required fields', async ({ page }) => {
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
    await expect(form.locator('input[name="name"], input[placeholder*="name" i]').first()).toBeVisible();
    await expect(form.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(form.locator('textarea').first()).toBeVisible();
  });

  test('WhatsApp link is present', async ({ page }) => {
    await expect(page.locator('a[href*="wa.me"]').first()).toBeVisible();
  });

  test('Google Maps link is present', async ({ page }) => {
    await expect(page.locator('a[href*="google.com/maps"]').first()).toBeVisible();
  });

  test('opening hours are shown', async ({ page }) => {
    await expect(page.locator('text=/5am/i').first()).toBeVisible();
  });
});
