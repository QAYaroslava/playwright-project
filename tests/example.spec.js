// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('enter value in search field', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.click('button[aria-label="Search"]');
  await page.fill('input[type="search"]', 'test');
});

test('scrolling', async ({ page }) => {
await page.goto('https://playwright.dev/');
await page.locator('#__docusaurus_skipToContent_fallback').evaluate(e => e.scrollTop += 100);
})