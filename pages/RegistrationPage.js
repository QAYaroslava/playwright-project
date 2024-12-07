const { expect } = require('@playwright/test');

class RegistrationPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
      this.page = page;
      this.signUpButton = this.page.locator('button:has-text("Sign up")');
      this.nameInput = this.page.locator('input[name="name"]');
      this.lastNameInput = this.page.locator('input[name="lastName"]');
      this.emailInput = this.page.locator('input[name="email"]');
      this.passwordInput = this.page.locator('input[name="password"]');
      this.repeatPasswordInput = this.page.locator('input[name="repeatPassword"]');
      this.registerButton = this.page.locator('button:has-text("Register")');
      this.addCarButton = this.page.locator('text=Add car');
    }
  
    async navigateTo() {
      await this.page.goto('/');
      await expect(this.page).toHaveURL(process.env.BASE_URL);
    }
  
    async openSignUpForm() {
      await this.signUpButton.click();
    }
  
    async fillRegistrationForm({ name, lastName, email, password, repeatPassword }) {
      await this.nameInput.fill(name);
      await this.lastNameInput.fill(lastName);
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.repeatPasswordInput.fill(repeatPassword);
    }
  
    async submitForm() {
      await this.registerButton.click();
    }
  
    async verifySuccessfulRegistration() {
      await expect(this.page).toHaveURL(`${process.env.BASE_URL}/panel/garage`);
      await expect(this.addCarButton).toBeVisible();
    }
  }
  
  module.exports = { RegistrationPage };