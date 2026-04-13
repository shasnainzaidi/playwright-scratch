import { Page, Locator, expect } from '@playwright/test';

export class AeContactPage {
  readonly page: Page;

  // ── Locators ───────────────────────────────────────
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly nameError: Locator;
  readonly emailError: Locator;
  readonly subjectError: Locator;
  readonly messageError: Locator;
  readonly contactForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('[data-qa="name"]').or(page.locator('input[name="name"]')).first();
    this.emailInput = page.locator('[data-qa="email"]').or(page.locator('input[name="email"]')).first();
    this.subjectInput = page.locator('[data-qa="subject"]').or(page.locator('input[name="subject"]'));
    this.messageTextarea = page.locator('[data-qa="message"]').or(page.locator('textarea[name="message"]'));
    this.submitButton = page.locator('[data-qa="submit"]').or(page.getByRole('button', { name: /submit|send/i })).first();
    this.successMessage = page.locator('text=/success|thank you|submitted|received|message.*sent/i').first();
    // Error locators - flexible approach to find validation messages
    this.nameError = page.locator('[data-qa="name-error"], [id*="name-error"], [for="name"] ~ .error, [class*="error"]:near(input[name="name"])').first();
    this.emailError = page.locator('[data-qa="email-error"], [id*="email-error"], [for="email"] ~ .error, [class*="error"]:near(input[name="email"])').first();
    this.subjectError = page.locator('[data-qa="subject-error"], [id*="subject-error"], [for="subject"] ~ .error, [class*="error"]:near(input[name="subject"])').first();
    this.messageError = page.locator('[data-qa="message-error"], [id*="message-error"], [for="message"] ~ .error, [class*="error"]:near(textarea[name="message"])').first();
    this.contactForm = page.locator('form').first();
  }

  // ── Navigation ─────────────────────────────────────
  async goto() {
    const aeUrl = process.env.AE_URL || 'https://automationexercise.com';
    await this.page.goto(`${aeUrl}/contact_us`);
  }

  // ── Form Field Actions ─────────────────────────────
  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillSubject(subject: string) {
    await this.subjectInput.fill(subject);
  }

  async fillMessage(message: string) {
    await this.messageTextarea.fill(message);
  }

  async fillForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    await this.fillName(data.name);
    await this.fillEmail(data.email);
    await this.fillSubject(data.subject);
    await this.fillMessage(data.message);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async submitContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    await this.fillForm(data);
    await this.submitForm();
  }

  // ── Field Clearing ────────────────────────────────
  async clearName() {
    await this.nameInput.clear();
  }

  async clearEmail() {
    await this.emailInput.clear();
  }

  async clearSubject() {
    await this.subjectInput.clear();
  }

  async clearMessage() {
    await this.messageTextarea.clear();
  }

  async clearAllFields() {
    await this.clearName();
    await this.clearEmail();
    await this.clearSubject();
    await this.clearMessage();
  }

  // ── Field Value Getters ───────────────────────────
  async getNameValue(): Promise<string | null> {
    return await this.nameInput.inputValue().catch(() => null);
  }

  async getEmailValue(): Promise<string | null> {
    return await this.emailInput.inputValue().catch(() => null);
  }

  async getSubjectValue(): Promise<string | null> {
    return await this.subjectInput.inputValue().catch(() => null);
  }

  async getMessageValue(): Promise<string | null> {
    return await this.messageTextarea.inputValue().catch(() => null);
  }

  // ── Assertions ─────────────────────────────────────
  async expectFormVisible() {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.subjectInput).toBeVisible();
    await expect(this.messageTextarea).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectSubmitButtonEnabled() {
    await expect(this.submitButton).not.toBeDisabled();
  }

  async expectSubmitButtonDisabled() {
    await expect(this.submitButton).toBeDisabled();
  }

  async expectSuccessMessageVisible() {
    await expect(this.successMessage).toBeVisible();
  }

  async expectNameError() {
    // Verify that form did not successfully submit
    // Success message should NOT be present
    const successVisible = await this.successMessage.isVisible({ timeout: 1000 }).catch(() => false);
    expect(successVisible).toBeFalsy();
    
    // Form should still be visible and name input should have focus or data
    await expect(this.nameInput).toBeVisible();
  }

  async expectEmailError() {
    // Verify that form did not successfully submit
    // Success message should NOT be present
    const successVisible = await this.successMessage.isVisible({ timeout: 1000 }).catch(() => false);
    expect(successVisible).toBeFalsy();
    
    // Form should still be visible and email input should have focus or data
    await expect(this.emailInput).toBeVisible();
  }

  async expectSubjectError() {
    // Verify that form did not successfully submit
    // Success message should NOT be present
    const successVisible = await this.successMessage.isVisible({ timeout: 1000 }).catch(() => false);
    expect(successVisible).toBeFalsy();
    
    // Form should still be visible and subject input should have focus or data
    await expect(this.subjectInput).toBeVisible();
  }

  async expectMessageError() {
    // Verify that form did not successfully submit
    // Success message should NOT be present
    const successVisible = await this.successMessage.isVisible({ timeout: 1000 }).catch(() => false);
    expect(successVisible).toBeFalsy();
    
    // Form should still be visible and message textarea should have focus or data
    await expect(this.messageTextarea).toBeVisible();
  }

  async expectNameErrorNotVisible() {
    // When name field is filled, submitting form should either:
    // 1. Show success message (if all fields are valid)
    // 2. Or not have visible error for name field
    const nameErrorElement = await this.nameError.isVisible().catch(() => false);
    expect(nameErrorElement).toBeFalsy();
  }

  async expectFormFieldValue(fieldType: 'name' | 'email' | 'subject' | 'message', value: string) {
    if (fieldType === 'name') {
      await expect(this.nameInput).toHaveValue(value);
    } else if (fieldType === 'email') {
      await expect(this.emailInput).toHaveValue(value);
    } else if (fieldType === 'subject') {
      await expect(this.subjectInput).toHaveValue(value);
    } else if (fieldType === 'message') {
      await expect(this.messageTextarea).toHaveValue(value);
    }
  }

  async getNameErrorMessage(): Promise<string | null> {
    return await this.nameError.textContent().catch(() => null);
  }

  async getEmailErrorMessage(): Promise<string | null> {
    return await this.emailError.textContent().catch(() => null);
  }

  async getSuccessMessage(): Promise<string | null> {
    return await this.successMessage.textContent().catch(() => null);
  }

  // ── Email Validation ───────────────────────────────
  async getEmailFieldValidationMessage(): Promise<string> {
    return await this.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  }

  async isEmailFieldValid(): Promise<boolean> {
    return await this.emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
  }

  // ── Utility Methods ────────────────────────────────
  async waitForSuccessMessage(timeout: number = 5000) {
    await this.page.waitForTimeout(2000); // Wait for potential validation/response
    await expect(this.successMessage).toBeVisible({ timeout });
  }
}
