const { test, expect } = require('@playwright/test');
const { RegistrationPage } = require('../pages/RegistrationPage');

function generateEmail(prefix) {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}@test.com`;
}

test.describe('Registration Tests', () => {
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigateTo();
    await page.waitForSelector('button:has-text("Sign up")');
  });

  test('Positive case', async () => {
    const testEmail = generateEmail('aqa');
    await registrationPage.openSignUpForm();
    await registrationPage.fillRegistrationForm({
      name: 'Anna',
      lastName: 'Johns',
      email: testEmail,
      password: 'Qwerty123',
      repeatPassword: 'Qwerty123',
    });
    await registrationPage.submitForm();
    await registrationPage.verifySuccessfulRegistration();
  });

  test('Negative case (empty fields)', async () => {
    await registrationPage.openSignUpForm();
    await registrationPage.fillRegistrationForm({
      name: '',
      lastName: '',
      email: '',
      password: '',
      repeatPassword: '',
    });

    await expect(registrationPage.nameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(registrationPage.lastNameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(registrationPage.emailInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(registrationPage.passwordInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');

    await expect(registrationPage.page.locator('.invalid-feedback p:has-text("Name required")').nth(0)).toBeVisible();
    await expect(registrationPage.page.locator('text=Last name required')).toBeVisible();
    await expect(registrationPage.page.locator('text=Email required')).toBeVisible();
    await expect(registrationPage.page.locator('text=Password required')).toBeVisible();
  });

  test('Negative case (short name and last name)', async () => {
    await registrationPage.openSignUpForm();
    await registrationPage.fillRegistrationForm({
      name: 'Y',
      lastName: 'J',
      email: '',
      password: '',
      repeatPassword: '',
    });

    await expect(registrationPage.nameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(registrationPage.lastNameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');

    await expect(registrationPage.page.locator('.invalid-feedback p:has-text("Name has to be from 2 to 20 characters long")').nth(0)).toBeVisible();
    await expect(registrationPage.page.locator('text=Last name has to be from 2 to 20 characters long')).toBeVisible();
  });

  test('Negative case (invalid password)', async () => {
    await registrationPage.openSignUpForm();
    await registrationPage.fillRegistrationForm({
      name: 'Anna',
      lastName: 'Johns',
      email: generateEmail('invalid-password'),
      password: 'test',
      repeatPassword: 'test',
    });

    await expect(registrationPage.passwordInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(
      registrationPage.page.locator(
        'text=Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
      )
    ).toBeVisible();
  });

  test('Negative case (passwords do not match)', async () => {
    await registrationPage.openSignUpForm();
    await registrationPage.fillRegistrationForm({
      name: 'Anna',
      lastName: 'Johns',
      password: 'Qwerty123',
      repeatPassword: 'Qwerty12',
      email: generateEmail('mismatch-password'),
    });

    const modalHeader = await registrationPage.page.locator('ngb-modal-window >> div >> div >> app-signup-modal >> div.modal-header');
    await modalHeader.waitFor({ state: 'visible', timeout: 5000 });
    await modalHeader.click();
    
    await expect(registrationPage.repeatPasswordInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(registrationPage.page.locator('text=Passwords do not match')).toBeVisible();
  });
});