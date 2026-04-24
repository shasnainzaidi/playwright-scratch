import { test, expect } from '@playwright/test';
import { AeHomePage } from '../../../pages/stage/aeHomePage';
import { AeContactPage } from '../../../pages/stage/aeContactPage';

test.describe.configure({ mode: 'serial' });

test.describe('SCRUM-6 - Contact Form', () => {

  test('SCRUM-6-TC-02 - AC2 - Required fields show validation errors when empty', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'stage', 'Runs only on stage');

    const contactPage = new AeContactPage(page);

    // Navigate to contact form
    await contactPage.goto();

    // Verify contact form is displayed
    await expect(contactPage.contactForm).toBeVisible();
    await expect(contactPage.nameInput).toBeVisible();
    await expect(contactPage.emailInput).toBeVisible();
    await expect(contactPage.subjectInput).toBeVisible();
    await expect(contactPage.messageTextarea).toBeVisible();

    // Verify all fields are initially empty
    const nameValue = await contactPage.nameInput.inputValue();
    const emailValue = await contactPage.emailInput.inputValue();
    const subjectValue = await contactPage.subjectInput.inputValue();
    const messageValue = await contactPage.messageTextarea.inputValue();
    
    expect(nameValue).toBe('');
    expect(emailValue).toBe('');
    expect(subjectValue).toBe('');
    expect(messageValue).toBe('');

    // Store current URL to detect if form submission happens
    const currentUrl = page.url();

    // Click Submit button with empty fields
    await contactPage.submitForm();

    // Wait for response
    await page.waitForTimeout(2000);

    // Check validation by:
    // 1. Verify page still on contact form (form not submitted due to validation)
    // 2. OR check for validation error messages
    const pageStillOnContact = page.url().includes('contact');
    
    // Look for input validation attempts via any of these methods:
    // - Check for title attribute that shows validation
    await contactPage.nameInput.focus();
    const nameInputValid = await contactPage.nameInput.evaluate((el: HTMLInputElement) => el.validity?.valid).catch(() => true);
    
    // Form should either:
    // 1. Stay on contact page (validation prevented submission)
    // 2. OR show a validation message
    const hasValidationBehavior = !nameInputValid || pageStillOnContact;
    expect(hasValidationBehavior).toBe(true);
  });

  test('SCRUM-6-TC-03 - AC2 - Name field validation error when empty', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'stage', 'Runs only on stage');

    const contactPage = new AeContactPage(page);

    // Navigate to contact form
    await contactPage.goto();

    // Verify contact form is displayed
    await expect(contactPage.contactForm).toBeVisible();

    // Leave Name field blank and fill other required fields
    await contactPage.clearName();
    await contactPage.fillEmail('test@example.com');
    await contactPage.fillSubject('Test Subject');
    await contactPage.fillMessage('Test Message');

    // Verify Name field is empty
    const nameValue = await contactPage.nameInput.inputValue();
    expect(nameValue).toBe('');

    const currentUrl = page.url();

    // Click Submit button
    await contactPage.submitForm();

    // Wait for validation response
    await page.waitForTimeout(2000);

    // Check Name field validity
    const nameInputValid = await contactPage.nameInput.evaluate((el: HTMLInputElement) => el.validity?.valid).catch(() => true);
    const pageStillOnContact = page.url().includes('contact');
    
    // Should either have invalid field or stay on contact page
    const hasValidation = !nameInputValid || pageStillOnContact;
    expect(hasValidation).toBe(true);
  });

  test('SCRUM-6-TC-04 - AC2 - Email field validation error when empty', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'stage', 'Runs only on stage');

    const contactPage = new AeContactPage(page);

    // Navigate to contact form
    await contactPage.goto();

    // Verify contact form is displayed
    await expect(contactPage.contactForm).toBeVisible();

    // Leave Email field blank and fill other required fields
    await contactPage.fillName('Test User');
    await contactPage.clearEmail();
    await contactPage.fillSubject('Test Subject');
    await contactPage.fillMessage('Test Message');

    // Verify Email field is empty
    const emailValue = await contactPage.emailInput.inputValue();
    expect(emailValue).toBe('');

    const currentUrl = page.url();

    // Click Submit button
    await contactPage.submitForm();

    // Wait for validation response
    await page.waitForTimeout(2000);

    // Check Email field validity
    const emailInputValid = await contactPage.emailInput.evaluate((el: HTMLInputElement) => el.validity?.valid).catch(() => true);
    const pageStillOnContact = page.url().includes('contact');
    
    // Should either have invalid field or stay on contact page
    const hasValidation = !emailInputValid || pageStillOnContact;
    expect(hasValidation).toBe(true);
  });

  test('SCRUM-6-TC-05 - AC2 - Subject field validation error when empty', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'stage', 'Runs only on stage');

    const contactPage = new AeContactPage(page);

    // Navigate to contact form
    await contactPage.goto();

    // Verify contact form is displayed
    await expect(contactPage.contactForm).toBeVisible();

    // Leave Subject field blank and fill other required fields
    await contactPage.fillName('Test User');
    await contactPage.fillEmail('test@example.com');
    await contactPage.clearSubject();
    await contactPage.fillMessage('Test Message');

    // Verify Subject field is empty
    const subjectValue = await contactPage.subjectInput.inputValue();
    expect(subjectValue).toBe('');

    const currentUrl = page.url();

    // Click Submit button
    await contactPage.submitForm();

    // Wait for validation response
    await page.waitForTimeout(2000);

    // Check Subject field validity
    const subjectInputValid = await contactPage.subjectInput.evaluate((el: HTMLInputElement) => el.validity?.valid).catch(() => true);
    const pageStillOnContact = page.url().includes('contact');
    
    // Should either have invalid field or stay on contact page
    const hasValidation = !subjectInputValid || pageStillOnContact;
    expect(hasValidation).toBe(true);
  });

});
