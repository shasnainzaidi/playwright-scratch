import { Page, Locator, expect } from '@playwright/test';

export class AeRegisterPage {
  readonly page: Page;

  // ── Locators ───────────────────────────────────────
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly signupButton: Locator;
  readonly titleMr: Locator;
  readonly passwordInput: Locator;
  readonly dobDay: Locator;
  readonly dobMonth: Locator;
  readonly dobYear: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileInput: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;
  readonly emailExistsError: Locator;
  readonly invalidEmailError: Locator;
  readonly nameErrorMessage: Locator;
  readonly passwordErrorMessage: Locator;
  readonly signupForm: Locator;
  readonly accountDetailsForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput           = page.locator('[data-qa="signup-name"]');
    this.emailInput          = page.locator('[data-qa="signup-email"]');
    this.signupButton        = page.locator('[data-qa="signup-button"]');
    this.titleMr             = page.locator('#id_gender1');
    this.passwordInput       = page.locator('[data-qa="password"]');
    this.dobDay              = page.locator('[data-qa="days"]');
    this.dobMonth            = page.locator('[data-qa="months"]');
    this.dobYear             = page.locator('[data-qa="years"]');
    this.firstNameInput      = page.locator('[data-qa="first_name"]');
    this.lastNameInput       = page.locator('[data-qa="last_name"]');
    this.addressInput        = page.locator('[data-qa="address"]');
    this.countrySelect       = page.locator('[data-qa="country"]');
    this.stateInput          = page.locator('[data-qa="state"]');
    this.cityInput           = page.locator('[data-qa="city"]');
    this.zipcodeInput        = page.locator('[data-qa="zipcode"]');
    this.mobileInput         = page.locator('[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('[data-qa="create-account"]');
    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');
    this.continueButton      = page.locator('[data-qa="continue-button"]');
    this.emailExistsError    = page.locator('p:has-text("Email Address already exist!")');
    this.invalidEmailError   = page.locator('text=/Invalid|invalid.*email|Email.*format/i');
    this.nameErrorMessage    = page.locator('text=/Name.*required|required.*Name/i');
    this.passwordErrorMessage = page.locator('text=/Password.*required|required.*Password/i');
    this.signupForm          = page.locator('[class*="signup"]').or(page.locator('form').first());
    this.accountDetailsForm  = page.locator('[class*="account"]').or(page.locator('form').nth(1));
  }

  // ── Actions ────────────────────────────────────────
  async goto() {
    const aeUrl = process.env.AE_URL || 'https://automationexercise.com';
    await this.page.goto(`${aeUrl}/login`);
  }

  async fillSignupName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillSignupEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async submitSignup() {
    await this.signupButton.click();
  }

  async signupWithNameAndEmail(name: string, email: string) {
    await this.fillSignupName(name);
    await this.fillSignupEmail(email);
    await this.submitSignup();
  }

  async fillAccountDetails(data: {
    password: string;
    day: string;
    month: string;
    year: string;
    firstName: string;
    lastName: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile: string;
  }) {
    await this.titleMr.check();
    await this.passwordInput.fill(data.password);
    await this.dobDay.selectOption(data.day);
    await this.dobMonth.selectOption(data.month);
    await this.dobYear.selectOption(data.year);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.addressInput.fill(data.address);
    await this.countrySelect.selectOption(data.country);
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileInput.fill(data.mobile);
  }

  async submitCreateAccount() {
    await this.createAccountButton.click();
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async completeSignupFlow(signupData: { name: string; email: string }, 
                           accountData: {
    password: string;
    day: string;
    month: string;
    year: string;
    firstName: string;
    lastName: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile: string;
  }) {
    await this.signupWithNameAndEmail(signupData.name, signupData.email);
    await this.page.waitForLoadState('networkidle');
    await this.fillAccountDetails(accountData);
    await this.submitCreateAccount();
    await this.page.waitForLoadState('networkidle');
  }

  // ── Assertions ─────────────────────────────────────
  async expectAccountCreated() {
    await expect(this.accountCreatedHeading).toBeVisible();
  }

  async expectEmailExistsError() {
    await expect(this.emailExistsError).toBeVisible();
  }

  async expectSignupFormVisible() {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.signupButton).toBeVisible();
  }

  async expectAccountDetailsFormVisible() {
    await expect(this.passwordInput).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.createAccountButton).toBeVisible();
  }

  async expectInvalidEmailError() {
    await expect(this.invalidEmailError).toBeVisible();
  }

  async expectNameFieldRequired() {
    const isRequired = await this.nameInput.evaluate<boolean, HTMLInputElement>(
      (el) => el.required || el.hasAttribute('data-required')
    );
    expect(isRequired).toBe(true);
  }

  async expectEmailFieldRequired() {
    const isRequired = await this.emailInput.evaluate<boolean, HTMLInputElement>(
      (el) => el.required || el.hasAttribute('data-required')
    );
    expect(isRequired).toBe(true);
  }

  async getEmailErrorMessage(): Promise<string | null> {
    return await this.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  }

  async getFormErrorMessages(): Promise<string[]> {
    return await this.page.locator('[class*="error"], [class*="danger"], .invalid-feedback').allTextContents();
  }
}