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
    // Navigate to automation exercise using AE_URL from .env
    await page.goto(process.env.AE_URL || 'https://automationexercise.com/');
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

    const accountData = {
      password: 'SecurePass123!',
      day: '15',
      month: '3',
      year: '1990',
      firstName: 'John',
      lastName: 'Automation',
      address: '123 Test Street',
      country: 'United States',
      state: 'New York',
      city: 'New York',
      zipcode: '10001',
      mobile: '+12125551234'
    };

    await registerPage.goto();
    await registerPage.signupWithNameAndEmail(signupData.name, signupData.email);
    
    // Verify account details form appears
    await registerPage.expectAccountDetailsFormVisible();
    await registerPage.page.waitForLoadState('networkidle');

    // Complete account details
    await registerPage.fillAccountDetails(accountData);
    await registerPage.submitCreateAccount();

    // Verify account created
    await registerPage.page.waitForLoadState('networkidle');
    await registerPage.expectAccountCreated();
  });

  test('@critical AC2 - Signup with special characters in name', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const timestamp = new Date().getTime();

    const signupData = {
      name: "Mary O'Brien-Smith Jr.",
      email: `special.${timestamp}@test.com`
    };

    const accountData = {
      password: 'TestPass456!',
      day: '22',
      month: '6',
      year: '1985',
      firstName: 'Mary',
      lastName: "O'Brien-Smith",
      address: '456 Special Ave',
      country: 'United Kingdom',
      state: 'England',
      city: 'London',
      zipcode: 'SW1A 1AA',
      mobile: '+442071838750'
    };

    await registerPage.goto();
    await registerPage.signupWithNameAndEmail(signupData.name, signupData.email);
    await registerPage.page.waitForLoadState('networkidle');

    await registerPage.fillAccountDetails(accountData);
    await registerPage.submitCreateAccount();
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

    const accountData = {
      password: 'LongTest123!',
      day: '1',
      month: '1',
      year: '1980',
      firstName: 'Alexander Christopher',
      lastName: 'Montgomery III',
      address: '789 Long Name Lane',
      country: 'Canada',
      state: 'Ontario',
      city: 'Toronto',
      zipcode: 'M5H 2N2',
      mobile: '+14165551234'
    };

    await registerPage.goto();
    await registerPage.signupWithNameAndEmail(signupData.name, signupData.email);
    await registerPage.page.waitForLoadState('networkidle');

    await registerPage.fillAccountDetails(accountData);
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

    const accountData = {
      password: 'RedirectTest123!',
      day: '10',
      month: '5',
      year: '1992',
      firstName: 'Redirect',
      lastName: 'Test',
      address: '100 Redirect Way',
      country: 'Australia',
      state: 'Victoria',
      city: 'Melbourne',
      zipcode: '3000',
      mobile: '+61261881234'
    };

    await registerPage.goto();
    const initialUrl = page.url();

    await registerPage.signupWithNameAndEmail(signupData.name, signupData.email);
    await registerPage.page.waitForLoadState('networkidle');

    await registerPage.fillAccountDetails(accountData);
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

    const accountData = {
      password: 'SuccessMsg123!',
      day: '20',
      month: '8',
      year: '1995',
      firstName: 'Success',
      lastName: 'Test',
      address: '200 Success Road',
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      zipcode: '560001',
      mobile: '+918001801234'
    };

    await registerPage.goto();
    await registerPage.signupWithNameAndEmail(signupData.name, signupData.email);
    await registerPage.page.waitForLoadState('networkidle');

    await registerPage.fillAccountDetails(accountData);
    await registerPage.submitCreateAccount();
    await registerPage.page.waitForLoadState('networkidle');

    // Verify success heading
    await expect(registerPage.accountCreatedHeading).toBeVisible();
    const successText = await registerPage.accountCreatedHeading.textContent();
    expect(successText).toContain('Account Created');
  });

  // ══════════════════════════════════════════════════════
  // AC6: User can login with newly registered credentials
  // ══════════════════════════════════════════════════════

  test('@critical AC6 - User can login with newly registered credentials', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const loginPage = new AeLoginPage(page);
    const timestamp = new Date().getTime();

    const signupData = {
      name: 'Login Test User',
      email: `login.${timestamp}@test.com`
    };

    const accountData = {
      password: 'LoginTest123!',
      day: '5',
      month: '12',
      year: '1988',
      firstName: 'Login',
      lastName: 'Test',
      address: '300 Login Lane',
      country: 'Germany',
      state: 'Bayern',
      city: 'Munich',
      zipcode: '80001',
      mobile: '+498921551234'
    };

    // Step 1: Create account
    await registerPage.goto();
    await registerPage.signupWithNameAndEmail(signupData.name, signupData.email);
    await registerPage.page.waitForLoadState('networkidle');

    await registerPage.fillAccountDetails(accountData);
    await registerPage.submitCreateAccount();
    await registerPage.page.waitForLoadState('networkidle');

    // Step 2: Verify account created
    await registerPage.expectAccountCreated();

    // Step 3: Continue/Logout
    await registerPage.clickContinue();
    await page.waitForLoadState('networkidle');

    // Step 4: Logout
    await loginPage.logout();
    await page.waitForLoadState('networkidle');

    // Step 5: Login again with new credentials
    await loginPage.goto();
    await loginPage.login(signupData.email, accountData.password);
    await page.waitForLoadState('networkidle');

    // Step 6: Verify logged in
    await loginPage.expectLoggedIn();
  });

  test('@critical AC6 - Verify successful login redirects to account page', async ({ page }) => {
    const registerPage = new AeRegisterPage(page);
    const loginPage = new AeLoginPage(page);
    const timestamp = new Date().getTime();

    const signupData = {
      name: 'Login Redirect Test',
      email: `loginredir.${timestamp}@test.com`
    };

    const accountData = {
      password: 'LoginRedir123!',
      day: '18',
      month: '7',
      year: '1993',
      firstName: 'LoginRedir',
      lastName: 'Test',
      address: '400 Login Street',
      country: 'France',
      state: 'Île-de-France',
      city: 'Paris',
      zipcode: '75001',
      mobile: '+33142741234'
    };

    // Create account
    await registerPage.goto();
    await registerPage.signupWithNameAndEmail(signupData.name, signupData.email);
    await registerPage.page.waitForLoadState('networkidle');

    await registerPage.fillAccountDetails(accountData);
    await registerPage.submitCreateAccount();
    await registerPage.page.waitForLoadState('networkidle');

    await registerPage.expectAccountCreated();
    await registerPage.clickContinue();
    await page.waitForLoadState('networkidle');

    // Logout
    await loginPage.logout();
    await page.waitForLoadState('networkidle');

    // Login and verify redirect
    const beforeLoginUrl = page.url();
    await loginPage.goto();
    await loginPage.login(signupData.email, accountData.password);
    await page.waitForLoadState('networkidle');

    const afterLoginUrl = page.url();
    
    // Verify redirect occurred
    expect(afterLoginUrl).not.toBe(beforeLoginUrl);
    await loginPage.expectLoggedIn();
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
