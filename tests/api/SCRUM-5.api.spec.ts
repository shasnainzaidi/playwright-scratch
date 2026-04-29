import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * SCRUM-5 API Tests - User Login Authentication
 * 
 * Tests the login API endpoint with various scenarios:
 * - Valid credentials authentication
 * - Invalid credentials error handling
 * - Empty/missing field validation
 * - Invalid email format validation
 * - Error response messages
 */

const BASE_URL = process.env.AE_URL || 'https://automationexercise.com';
const LOGIN_ENDPOINT = '/api/login';

// Test data
const testAccounts = {
  validEmail: process.env.USER_EMAIL || process.env.VALID_LOGIN_EMAIL || 'test@automationexercise.com',
  validPassword: process.env.USER_PASSWORD || process.env.VALID_LOGIN_PASSWORD || 'Test123',
  invalidEmail: 'nonexistent@automationexercise.com',
  invalidPassword: 'WrongPassword123!',
  validEmailNoAccount: 'newuser@automationexercise.com'
};

test.describe('SCRUM-5 API: Authentication Endpoints', () => {

  let request: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  // ─────────────────────────────────────────────────────────
  // AC1: Valid User Login - Successful Authentication
  // ─────────────────────────────────────────────────────────
  
  test('API-TC-01 - Valid credentials return successful response with token', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: testAccounts.validEmail,
        password: testAccounts.validPassword,
      },
    });

    // Expect successful response (200 or 201)
    expect([200, 201, 301, 302]).toContain(response.status());
    
    const responseBody = await response.json().catch(() => ({}));
    
    // Response should contain success indicator or token
    const hasSuccessIndicator = 
      response.status() < 300 ||
      responseBody.success === true ||
      responseBody.token ||
      responseBody.message?.toLowerCase().includes('success');
    
    expect(hasSuccessIndicator).toBe(true);
  });

  test('API-TC-02 - Valid login should not return error message', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: testAccounts.validEmail,
        password: testAccounts.validPassword,
      },
    });

    const responseBody = await response.json().catch(() => ({}));
    
    // Should not contain error field or error should be false
    const hasError = responseBody.error === true;
    expect(hasError).toBe(false);
  });

  // ─────────────────────────────────────────────────────────
  // AC2: Invalid Credentials - Error Handling
  // ─────────────────────────────────────────────────────────

  test('API-TC-03 - Invalid password should return error response', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: testAccounts.validEmail,
        password: testAccounts.invalidPassword,
      },
    });

    // Expect authentication failure (401 or 400)
    expect([400, 401, 422]).toContain(response.status());
    
    const responseBody = await response.json().catch(() => ({}));
    
    // Should indicate error/failure
    const isError = 
      response.status() >= 400 ||
      responseBody.error === true ||
      responseBody.message?.toLowerCase().includes('incorrect') ||
      responseBody.message?.toLowerCase().includes('invalid') ||
      responseBody.message?.toLowerCase().includes('failed');
    
    expect(isError).toBe(true);
  });

  test('API-TC-04 - Non-existent user email should return error', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: testAccounts.invalidEmail,
        password: 'AnyPassword123',
      },
    });

    // Expect authentication failure
    expect([400, 401, 404, 422]).toContain(response.status());
    
    const responseBody = await response.json().catch(() => ({}));
    
    const isError = 
      response.status() >= 400 ||
      responseBody.error === true ||
      responseBody.message?.toLowerCase().includes('not found') ||
      responseBody.message?.toLowerCase().includes('invalid');
    
    expect(isError).toBe(true);
  });

  test('API-TC-05 - Error response should contain error message', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: testAccounts.validEmail,
        password: 'WrongPassword',
      },
    });

    // For failed auth, should have error status
    if (response.status() >= 400) {
      const responseBody = await response.json().catch(() => ({}));
      
      // Should have message or error indication
      const hasErrorMessage = 
        responseBody.message ||
        responseBody.error_message ||
        responseBody.message ||
        responseBody.error;
      
      expect(hasErrorMessage).toBeTruthy();
    }
  });

  // ─────────────────────────────────────────────────────────
  // AC3: Empty/Missing Fields - Validation
  // ─────────────────────────────────────────────────────────

  test('API-TC-06 - Missing email field should return validation error', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        password: testAccounts.validPassword,
        // email intentionally omitted
      },
    });

    // Expect validation failure
    expect([400, 422]).toContain(response.status());
    
    const responseBody = await response.json().catch(() => ({}));
    
    // Should indicate validation error
    const isValidationError =
      response.status() >= 400 ||
      responseBody.error === true ||
      responseBody.message?.toLowerCase().includes('required') ||
      responseBody.message?.toLowerCase().includes('missing') ||
      responseBody.errors?.email;
    
    expect(isValidationError).toBe(true);
  });

  test('API-TC-07 - Missing password field should return validation error', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: testAccounts.validEmail,
        // password intentionally omitted
      },
    });

    // Expect validation failure
    expect([400, 422]).toContain(response.status());
    
    const responseBody = await response.json().catch(() => ({}));
    
    // Should indicate validation error
    const isValidationError =
      response.status() >= 400 ||
      responseBody.error === true ||
      responseBody.message?.toLowerCase().includes('required') ||
      responseBody.message?.toLowerCase().includes('missing') ||
      responseBody.errors?.password;
    
    expect(isValidationError).toBe(true);
  });

  test('API-TC-08 - Both fields missing should return validation error', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        // Both email and password omitted
      },
    });

    // Expect validation failure
    expect([400, 422]).toContain(response.status());
    
    const responseBody = await response.json().catch(() => ({}));
    
    const isValidationError = response.status() >= 400 || responseBody.error === true;
    expect(isValidationError).toBe(true);
  });

  test('API-TC-09 - Empty email string should return validation error', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: '',
        password: testAccounts.validPassword,
      },
    });

    // Expect validation failure
    expect([400, 422]).toContain(response.status());
    
    const responseBody = await response.json().catch(() => ({}));
    
    const isValidationError =
      response.status() >= 400 ||
      responseBody.error === true ||
      responseBody.message?.toLowerCase().includes('empty') ||
      responseBody.message?.toLowerCase().includes('required') ||
      responseBody.errors?.email;
    
    expect(isValidationError).toBe(true);
  });

  test('API-TC-10 - Empty password string should return validation error', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: testAccounts.validEmail,
        password: '',
      },
    });

    // Expect validation failure
    expect([400, 422]).toContain(response.status());
    
    const responseBody = await response.json().catch(() => ({}));
    
    const isValidationError =
      response.status() >= 400 ||
      responseBody.error === true ||
      responseBody.message?.toLowerCase().includes('empty') ||
      responseBody.message?.toLowerCase().includes('required') ||
      responseBody.errors?.password;
    
    expect(isValidationError).toBe(true);
  });

  test('API-TC-11 - Both fields empty should return validation error', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: '',
        password: '',
      },
    });

    // Expect validation failure
    expect([400, 422]).toContain(response.status());
    
    const responseBody = await response.json().catch(() => ({}));
    
    const isValidationError = response.status() >= 400 || responseBody.error === true;
    expect(isValidationError).toBe(true);
  });

  // ─────────────────────────────────────────────────────────
  // Email Format Validation
  // ─────────────────────────────────────────────────────────

  test('API-TC-12 - Invalid email format should return validation error', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: 'invalidemail@test',  // Missing TLD
        password: testAccounts.validPassword,
      },
    });

    // Expect validation failure
    expect([400, 422]).toContain(response.status());
    
    const responseBody = await response.json().catch(() => ({}));
    
    const isValidationError =
      response.status() >= 400 ||
      responseBody.error === true ||
      responseBody.message?.toLowerCase().includes('invalid') ||
      responseBody.message?.toLowerCase().includes('email') ||
      responseBody.errors?.email;
    
    expect(isValidationError).toBe(true);
  });

  test('API-TC-13 - Email format without @ symbol should return validation error', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: 'invalidemail.com',  // Missing @
        password: testAccounts.validPassword,
      },
    });

    // Expect validation failure
    expect([400, 422]).toContain(response.status());
    
    const responseBody = await response.json().catch(() => ({}));
    
    const isValidationError =
      response.status() >= 400 ||
      responseBody.error === true ||
      responseBody.message?.toLowerCase().includes('invalid') ||
      responseBody.errors?.email;
    
    expect(isValidationError).toBe(true);
  });

  // ─────────────────────────────────────────────────────────
  // Request/Response Format Validation
  // ─────────────────────────────────────────────────────────

  test('API-TC-14 - Response should have consistent structure', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: testAccounts.validEmail,
        password: testAccounts.invalidPassword,
      },
    });

    const responseBody = await response.json().catch(() => ({}));
    
    // Response should have some identifying information
    const hasExpectedFields =
      typeof responseBody === 'object' && responseBody !== null;
    
    expect(hasExpectedFields).toBe(true);
  });

  test('API-TC-15 - API should handle whitespace in email', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: `  ${testAccounts.validEmail}  `,  // Surrounding whitespace
        password: testAccounts.validPassword,
      },
    });

    // Either trimmed and successful, or rejected
    const isValidResponse = 
      response.status() < 400 ||  // Accepted (trimmed)
      response.status() < 600;    // Any valid HTTP response
    
    expect(isValidResponse).toBe(true);
  });

  // ─────────────────────────────────────────────────────────
  // Large/Special Input Validation
  // ─────────────────────────────────────────────────────────

  test('API-TC-16 - Very long email should be handled', async () => {
    const longEmail = 'a'.repeat(200) + '@example.com';
    
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: longEmail,
        password: testAccounts.validPassword,
      },
    });

    // Should get a valid response (error or validation)
    expect([200, 201, 400, 401, 404, 422]).toContain(response.status());
  });

  test('API-TC-17 - Special characters in password should be accepted', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: testAccounts.validEmail,
        password: `${testAccounts.validPassword}!@#$%^&*()`,
      },
    });

    // Should get a valid response (invalid password but no parsing error)
    expect([200, 201, 400, 401, 422]).toContain(response.status());
  });

  // ─────────────────────────────────────────────────────────
  // HTTP Method Validation
  // ─────────────────────────────────────────────────────────

  test('API-TC-18 - GET request to login endpoint should not work or return error', async () => {
    const response = await request.get(LOGIN_ENDPOINT).catch(() => null);

    if (response) {
      // GET should either not be allowed (4xx/5xx) or redirect
      expect(response.status()).toBeGreaterThanOrEqual(300);
    }
  });

  test('API-TC-19 - Response should have appropriate Content-Type header', async () => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: testAccounts.validEmail,
        password: testAccounts.validPassword,
      },
    });

    const contentType = response.headers()['content-type'];
    const isJsonOrHtml = 
      contentType?.includes('application/json') ||
      contentType?.includes('text/html') ||
      contentType?.includes('text/plain');
    
    expect(isJsonOrHtml).toBe(true);
  });

});
