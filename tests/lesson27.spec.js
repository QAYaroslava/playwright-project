import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const test = base.extend({
  userGaragePage: async ({ browser }, use) => {
    const storageStatePath = path.resolve(__dirname, 'storageState.json');

    if (!fs.existsSync(storageStatePath)) {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('/');
      await page.waitForSelector('button:has-text("Sign in")');
      await expect(page).toHaveURL('https://qauto.forstudy.space/');

      await page.click('button:has-text("Sign in")');
      await page.fill('input[name="email"]', 'yarakucherenko07@gmail.com');
      await page.fill('input[name="password"]', 'Qwerty123');
      await page.click('button:has-text("Login")');
      await expect(page).toHaveURL('https://qauto.forstudy.space/panel/garage');

      await context.storageState({ path: storageStatePath });
      await context.close();
    }

    const context = await browser.newContext({ storageState: storageStatePath });
    const page = await context.newPage();
    await page.goto('https://qauto.forstudy.space/panel/garage');
    await use(page);
    await context.close();
  },
});

test.setTimeout(60000);

test('Garage page should display Add car button', async ({ userGaragePage }) => {
  await expect(userGaragePage.locator('text=Add car')).toBeVisible();
});