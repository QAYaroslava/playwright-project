import { test, expect } from '@playwright/test';


test.describe('Mocking response', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('button:has-text("Sign in")');
    await expect(page).toHaveURL('https://qauto.forstudy.space/');
  });

  test('Mocking data for profile', async ({ page }) => {
    test.setTimeout(30000);
    await expect(page).toHaveURL('https://qauto.forstudy.space/');

    await page.click('button:has-text("Sign in")');

    await page.fill('input[name="email"]', 'yarakucherenko07@gmail.com');
    await page.fill('input[name="password"]', 'Qwerty123');

    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL('https://qauto.forstudy.space/panel/garage');
    await expect(page.locator('text=Add car')).toBeVisible();
    await page.goto('https://qauto.forstudy.space/panel/profile');
    await page.pause()

    await page.route('https://qauto.forstudy.space/api/users/profile', async route => {
      const mockedResponse = {
        status: "ok",
        data: {
        lastName: "test",
        name: "Hillel",
        photoFilename: "default-user.png",
        userId: 160794,
      }
    };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedResponse),
      });
    });

    await page.goto('https://qauto.forstudy.space/panel/profile');
    await page.pause()
  });
})