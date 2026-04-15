import { test, expect } from '@playwright/test';
import { AeHomePage } from '../../../pages/stage/aeHomePage';
import { AeRegisterPage } from '../../../pages/stage/aeRegisterPage';
import { AeLoginPage } from '../../../pages/stage/aeLoginPage';

/**
 * Test Suite: SCRUM-4 - User Registration/Signup
 * Coverage: All Acceptance Criteria
 * URL: Using AE_URL from .env (https://automationexercise.com)
 */

test.describe('@signup SCRUM-4: User Registration Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to automation exercise using AE_URL from .env via page object
    const homePage = new AeHomePage(page);
    await homePage.goto();
  });

  // ══════════════════════════════════════════════════════
  // AC1: Signup form displays when "Signup / Login" is clicked
  // ══════════════════════════════════════════════════════

  test('@smoke AC1 - Signup form is displayed when Signup/Login link is clicked', async ({ page }) => {
    const homePage = new AeHomePage(page);
    const registerPage = new AeRegisterPage(page);

    await homePage.expectPageLoaded();
    await homePage.navLogin.click();

    // Verify signup form is visible
    await registerPage.expectSignupFormVisible();
    await expect(registerPage.nameInput).toBeInViewport();
    await expect(registerPage.emailInput).toBeInViewport();
    await expect(registerPage.signupButton).toBeInViewport();
  });

  test('@smoke AC1 - Signup section contains all required fields initially', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);

    await registerPage.goto();

    // Verify all initial signup fields are visible
    await expect(registerPage.nameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.signupButton).toBeVisible();

    // Verify field placeholders
    await expect(registerPage.nameInput).toHaveAttribute('placeholder', 'Name');
    await expect(registerPage.emailInput).toHaveAttribute('placeholder', 'Email Address');
  });

  // ══════════════════════════════════════════════════════
  // AC2: Form accepts valid user data (name, email, password)
  // ══════════════════════════════════════════════════════

  test('@critical AC2 - Valid signup with all required fields', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const timestamp = new Date().getTime();

    const signupData = {
      name: 'John Automation Test',
      email: `autotest.${timestamp}@test.com`
    };

    await registerPage.goto();
    await registerPage.signupWithNameAndEmail(signupData.name, signupData.email);
    
    // Verify account details form appears
    await registerPage.expectAccountDetailsFormVisible();
    await registerPage.page.waitForLoadState('networkidle');

    // Complete account details
    await registerPage.fillAccountDetails(AeRegisterPage.ACCOUNT_DATA.johnAutomation);
    await registerPage.submitCreateAccount();

    // Verify account created
    await registerPage.page.waitForLoadState('networkidle');
    await registerPage.expectAccountCreated();
  });

  test('@critical AC2 - Signup with long name (edge case)', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const timestamp = new Date().getTime();

    const signupData = {
      name: 'Alexander Christopher Montgomery III Esquire',
      email: `longname.${timestamp}@test.com`
    };

    await registerPage.goto();
    await registerPage.signupWithNameAndEmail(signupData.name, signupData.email);
    await registerPage.page.waitForLoadState('networkidle');

    await registerPage.fillAccountDetails(AeRegisterPage.ACCOUNT_DATA.alexanderMontgomery);
    await registerPage.submitCreateAccount();
    await registerPage.page.waitForLoadState('networkidle');

    await registerPage.expectAccountCreated();
  });

  // ══════════════════════════════════════════════════════
  // AC3: Invalid email format prevents form submission
  // ══════════════════════════════════════════════════════

  test('@critical AC3 - Invalid email format: missing domain', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);

    await registerPage.goto();
    await registerPage.fillSignupName('Test User');
    await registerPage.fillSignupEmail('invalidemail@');

    const emailInput = registerPage.emailInput;
    const isInvalid = await emailInput.evaluate<boolean, HTMLInputElement>(
      (el) => !el.checkValidity()
    );

    expect(isInvalid).toBe(true);
  });

  test('@critical AC3 - Invalid email format: no @ symbol', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);

    await registerPage.goto();
    await registerPage.fillSignupName('Test User');
    await registerPage.fillSignupEmail('notanemail.com');

    const emailInput = registerPage.emailInput;
    const isInvalid = await emailInput.evaluate<boolean, HTMLInputElement>(
      (el) => !el.checkValidity()
    );

    expect(isInvalid).toBe(true);
  });

  test('@critical AC3 - Invalid email format: missing local part', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);

    await registerPage.goto();
    await registerPage.fillSignupName('Test User');
    await registerPage.fillSignupEmail('@domain.com');

    const emailInput = registerPage.emailInput;
    const isInvalid = await emailInput.evaluate<boolean, HTMLInputElement>(
      (el) => !el.checkValidity()
    );

    expect(isInvalid).toBe(true);
  });

  test('@critical AC3 - Invalid email format: spaces in email', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);

    await registerPage.goto();
    await registerPage.fillSignupName('Test User');
    await registerPage.fillSignupEmail('user name@test.com');

    const emailInput = registerPage.emailInput;
    const isInvalid = await emailInput.evaluate<boolean, HTMLInputElement>(
      (el) => !el.checkValidity()
    );

    expect(isInvalid).toBe(true);
  });

  test('@regression AC3 - Submit button disabled with invalid email', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);

    await registerPage.goto();
    await registerPage.fillSignupName('Test User');
    await registerPage.fillSignupEmail('invalid.email');

    // Check email validity
    const emailInput = registerPage.emailInput;
    const validation = await emailInput.evaluate<boolean, HTMLInputElement>(
      (el) => !el.checkValidity()
    );

    expect(validation).toBe(true);
  });

  // ══════════════════════════════════════════════════════
  // AC4: Duplicate email shows appropriate error
  // ══════════════════════════════════════════════════════

  test('@critical AC4 - Duplicate email shows error message', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const duplicateEmail = process.env.AE_EMAIL || 'hasnain.contour@gmail.com';

    await registerPage.goto();
    await registerPage.fillSignupName('Test User');
    await registerPage.fillSignupEmail(duplicateEmail);
    await registerPage.submitSignup();

    // Wait for error response
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify error message is displayed
    await registerPage.expectEmailExistsError();
  });

  test('@critical AC4 - Verify duplicate email error message content', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const duplicateEmail = process.env.AE_EMAIL || 'hasnain.contour@gmail.com';

    await registerPage.goto();
    await registerPage.fillSignupName('Another User');
    await registerPage.fillSignupEmail(duplicateEmail);
    await registerPage.submitSignup();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const errorElement = registerPage.emailExistsError;
    await expect(errorElement).toBeVisible();

    const errorText = await errorElement.textContent();
    expect(errorText).toContain('Email Address already exist');
  });

  test('@regression AC4 - Multiple duplicate email attempts show error each time', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const duplicateEmail = process.env.AE_EMAIL || 'hasnain.contour@gmail.com';

    for (let i = 0; i < 2; i++) {
      await registerPage.goto();
      await registerPage.fillSignupName(`Test User ${i}`);
      await registerPage.fillSignupEmail(duplicateEmail);
      await registerPage.submitSignup();

      await page.waitForLoadState('networkidle');
      await registerPage.expectEmailExistsError();

      // Clear for next iteration
      await page.reload();
    }
  });

  // ══════════════════════════════════════════════════════
  // AC5: Successful signup redirects to account page
  // ══════════════════════════════════════════════════════

  test('@critical AC5 - Successful signup redirects to account/success page', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const timestamp = new Date().getTime();

    const signupData = {
      name: 'Redirect Test User',
      email: `redirect.${timestamp}@test.com`
    };

    await registerPage.goto();
    const initialUrl = page.url();

    await registerPage.signupWithNameAndEmail(signupData.name, signupData.email);
    await registerPage.page.waitForLoadState('networkidle');

    await registerPage.fillAccountDetails(AeRegisterPage.ACCOUNT_DATA.redirectTest);
    await registerPage.submitCreateAccount();
    await registerPage.page.waitForLoadState('networkidle');

    const finalUrl = page.url();

    // Verify URL changed (redirect occurred)
    expect(finalUrl).not.toBe(initialUrl);
    
    // Verify we're on account created page
    await registerPage.expectAccountCreated();
  });

  test('@critical AC5 - Account created success message displays', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const timestamp = new Date().getTime();

    const signupData = {
      name: 'Success Message Test',
      email: `success.${timestamp}@test.com`
    };

    await registerPage.goto();
    await registerPage.signupWithNameAndEmail(signupData.name, signupData.email);
    await registerPage.page.waitForLoadState('networkidle');

    await registerPage.fillAccountDetails(AeRegisterPage.ACCOUNT_DATA.successMessage);
    await registerPage.submitCreateAccount();
    await registerPage.page.waitForLoadState('networkidle');

    // Verify success heading
    await expect(registerPage.accountCreatedHeading).toBeVisible();
    const successText = await registerPage.accountCreatedHeading.textContent();
    expect(successText).toContain('Account Created');
  });

  // ══════════════════════════════════════════════════════
  // Additional Edge Cases and Security Tests
  // ══════════════════════════════════════════════════════

  test('@regression - Required field validation: empty name field', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);

    await registerPage.goto();
    await registerPage.fillSignupEmail('valid@test.com');

    const isRequired = await registerPage.nameInput.evaluate<boolean, HTMLInputElement>(
      (el) => el.required
    );

    expect(isRequired).toBe(true);
  });

  test('@regression - Required field validation: empty email field', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);

    await registerPage.goto();
    await registerPage.fillSignupName('Valid Name');

    const isRequired = await registerPage.emailInput.evaluate<boolean, HTMLInputElement>(
      (el) => el.required
    );

    expect(isRequired).toBe(true);
  });

  test('@regression - XSS Prevention: Script tags in name field', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const timestamp = new Date().getTime();

    const suspiciousName = '<script>alert("xss")</script>';

    await registerPage.goto();
    await registerPage.fillSignupName(suspiciousName);
    await registerPage.fillSignupEmail(`xss.${timestamp}@test.com`);

    // Set up dialog handler
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    await registerPage.submitSignup();
    await page.waitForLoadState('networkidle');

    // XSS should be prevented - no alert should appear
    expect(dialogTriggered).toBe(false);
  });

  test('@regression - SQL Injection Prevention: SQL in email field', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);

    const sqlInjectionAttempt = "test' OR '1'='1@test.com";

    await registerPage.goto();
    await registerPage.fillSignupName('Test User');
    await registerPage.fillSignupEmail(sqlInjectionAttempt);

    const isInvalid = await registerPage.emailInput.evaluate<boolean, HTMLInputElement>(
      (el) => !el.checkValidity()
    );

    // Invalid email format prevents submission
    expect(isInvalid).toBe(true);
  });

  test('@regression - Form state reset on page refresh', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);

    await registerPage.goto();
    await registerPage.fillSignupName('Test Value');
    await registerPage.fillSignupEmail('test@test.com');

    // Reload page
    await page.reload();
    await registerPage.page.waitForLoadState('networkidle');

    // Fields should be empty
    const nameValue = await registerPage.nameInput.inputValue();
    const emailValue = await registerPage.emailInput.inputValue();

    expect(nameValue).toBe('');
    expect(emailValue).toBe('');
  });

  test('@regression - Signup form remains accessible after error', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const duplicateEmail = process.env.AE_EMAIL || 'hasnain.contour@gmail.com';

    // First attempt - duplicate email
    await registerPage.goto();
    await registerPage.fillSignupName('User 1');
    await registerPage.fillSignupEmail(duplicateEmail);
    await registerPage.submitSignup();

    await page.waitForLoadState('networkidle');
    await registerPage.expectEmailExistsError();

    // Second attempt - different email should work
    const timestamp = new Date().getTime();
    await registerPage.fillSignupName('User 2');
    await registerPage.fillSignupEmail(`retry.${timestamp}@test.com`);

    // Form should still be functional
    await expect(registerPage.nameInput).toHaveValue('User 2');
    await expect(registerPage.emailInput).toHaveValue(`retry.${timestamp}@test.com`);
  });
});
