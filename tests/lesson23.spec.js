import { test, expect } from '@playwright/test';

function generateEmail(prefix) {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}@test.com`;
}

test.describe('Registration Tests', () => {
  let testEmail;
  testEmail = generateEmail('aqa');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('button:has-text("Sign up")');
    await expect(page).toHaveURL('https://qauto.forstudy.space/');
  });

  test('Positive case', async ({ page }) => {
    test.setTimeout(30000);
    await expect(page).toHaveURL('https://qauto.forstudy.space/');

    await page.click('button:has-text("Sign up")');

    await page.fill('input[name="name"]', 'Anna');
    await page.fill('input[name="lastName"]', 'Johns');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'Qwerty123');
    await page.fill('input[name="repeatPassword"]', 'Qwerty123');

    await page.click('button:has-text("Register")');

    await expect(page).toHaveURL('https://qauto.forstudy.space/panel/garage');
    await expect(page.locator('text=Add car')).toBeVisible();
  });

  test('Negative case (with empty fields)', async ({ page }) => {
    test.setTimeout(30000);
    await expect(page).toHaveURL('https://qauto.forstudy.space/');

    await page.click('button:has-text("Sign up")');

    await page.fill('input[name="name"]', '');
    await page.fill('input[name="lastName"]', '');
    await page.fill('input[name="email"]', '');
    await page.fill('input[name="password"]', '');
    await page.fill('input[name="repeatPassword"]', '');

    const nameInput = page.locator('input[name="name"]');
    const lastNameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await expect(nameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(lastNameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(emailInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(passwordInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');

    const nameError = page.locator('.invalid-feedback p:has-text("Name required")').nth(0);
    const lastNameError = page.locator('text=Last name required');
    const emailError = page.locator('text=Email required');
    const passwordError = page.locator('text=Password required');

    await expect(nameError).toBeVisible();
    await expect(lastNameError).toBeVisible();
    await expect(emailError).toBeVisible();
    await expect(passwordError).toBeVisible();

  });

  test('Negative case (with too short first and last name)', async ({ page }) => {
    test.setTimeout(30000);
    await expect(page).toHaveURL('https://qauto.forstudy.space/');

    await page.click('button:has-text("Sign up")');

    await page.fill('input[name="name"]', 'Y');
    await page.fill('input[name="lastName"]', 'J');
    await page.click('input[name="email"]', '');

    const nameInput = page.locator('input[name="name"]');
    const lastNameInput = page.locator('input[name="lastName"]');

    await expect(nameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(lastNameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');

    const nameError = page.locator('.invalid-feedback p:has-text("Name has to be from 2 to 20 characters long")').nth(0);
    const lastNameError = page.locator('text=Last name has to be from 2 to 20 characters long');

    await expect(nameError).toBeVisible();
    await expect(lastNameError).toBeVisible();
  });

  test('Negative case (invalid password)', async ({ page }) => {
    test.setTimeout(30000);
    await expect(page).toHaveURL('https://qauto.forstudy.space/');

    await page.click('button:has-text("Sign up")');

    await page.fill('input[name="password"]', 'test');
    await page.click('input[name="repeatPassword"]', '');

    const passwordInput = page.locator('input[name="password"]');

    await expect(passwordInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');

    const passwordError = page.locator('text=Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');

    await expect(passwordError).toBeVisible();
  });

  test('Negative case (invalid email)', async ({ page }) => {
    await expect(page).toHaveURL('https://qauto.forstudy.space/');

    await page.click('button:has-text("Sign up")');

    await page.fill('input[name="email"]', 'test');
    await page.click('input[name="password"]', '');

    const emailInput = page.locator('input[name="email"]');

    await expect(emailInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');

    const emailError = page.locator('text=Email is incorrect');

    await expect(emailError).toBeVisible();

  });

  test('Negative case (passwords do not match)', async ({ page }) => {
    await expect(page).toHaveURL('https://qauto.forstudy.space/');

    await page.click('button:has-text("Sign up")');

    await page.fill('input[name="password"]', 'Qwerty123');
    await page.fill('input[name="repeatPassword"]', 'Qwerty12');
    await page.click('input[name="email"]', '');

    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await expect(repeatPasswordInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');

    const repeatPasswordError = page.locator('text=Passwords do not match');

    await expect(repeatPasswordError).toBeVisible();

  });
})