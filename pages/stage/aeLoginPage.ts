import { Page, Locator, expect } from '@playwright/test';

export class AeLoginPage {
  readonly page: Page;

  // ── Locators ───────────────────────────────────────
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;
  readonly loggedInUsername: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput     = page.locator('[data-qa="login-email"]');
    this.passwordInput  = page.locator('[data-qa="login-password"]');
    this.loginButton    = page.locator('[data-qa="login-button"]');
    this.loginError     = page.locator('p:has-text("Your email or password is incorrect!")');
    this.loggedInUsername = page.locator('a:has-text("Logged in as")');
    this.logoutLink     = page.locator('a[href="/logout"]');
  }

  // ── Actions ────────────────────────────────────────
  async goto() {
    const aeUrl = process.env.AE_URL || 'https://automationexercise.com';
    await this.page.goto(`${aeUrl}/login`);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  // ── Assertions ─────────────────────────────────────
  async expectLoggedIn(username?: string) {
    await expect(this.loggedInUsername).toBeVisible();
    if (username) {
      await expect(this.loggedInUsername).toContainText(username);
    }
  }

  async expectLoginError() {
    await expect(this.loginError).toBeVisible();
  }

  async expectLoggedOut() {
    await expect(this.page).toHaveURL(/\/login/);
  }
}