/**
 * SCRUM-5 API Authentication Contract
 * 
 * This file documents the expected API contract for login authentication.
 * Use this to understand expected endpoints, request/response formats, and status codes.
 */

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN ENDPOINT CONTRACT
// ═══════════════════════════════════════════════════════════════════════════

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  success: true;
  token?: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
  message?: string;
}

export interface LoginErrorResponse {
  error: true;
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
}

export interface ValidationErrorResponse {
  error: true;
  message: string;
  errors: {
    [field: string]: string[];
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDPOINT SPECIFICATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * POST /api/login
 * 
 * Description:
 *   Authenticates a user with email and password credentials. Returns a session
 *   token or establishes session if authentication successful.
 * 
 * HTTP Method: POST
 * Content-Type: application/json
 * 
 * Request Body:
 *   {
 *     "email": "user@example.com",
 *     "password": "password123"
 *   }
 * 
 * Success Response (200/201):
 *   {
 *     "success": true,
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "user": {
 *       "id": 1,
 *       "email": "user@example.com",
 *       "name": "John Doe"
 *     },
 *     "message": "Login successful"
 *   }
 * 
 * Error Responses:
 * 
 * 400 - Validation Error:
 *   {
 *     "error": true,
 *     "message": "Validation failed",
 *     "errors": {
 *       "email": ["Email is required"],
 *       "password": ["Password is required"]
 *     }
 *   }
 * 
 * 401 - Authentication Failed:
 *   {
 *     "error": true,
 *     "message": "Invalid credentials"
 *   }
 * 
 * 404 - User Not Found:
 *   {
 *     "error": true,
 *     "message": "User not found"
 *   }
 * 
 * 422 - Unprocessable Entity:
 *   {
 *     "error": true,
 *     "message": "Invalid email format",
 *     "errors": {
 *       "email": ["Invalid email format"]
 *     }
 *   }
 * 
 * 500 - Server Error:
 *   {
 *     "error": true,
 *     "message": "Internal server error"
 *   }
 */

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION RULES
// ═══════════════════════════════════════════════════════════════════════════

const ValidationRules = {
  email: {
    required: true,
    format: 'RFC 5322 compliant email',
    minLength: 5,
    maxLength: 255,
    trimmed: 'Should trim whitespace',
    caseSensitive: false,
  },
  password: {
    required: true,
    minLength: 0,  // Depends on application requirements
    maxLength: 500,
    charset: 'Any UTF-8 character',
    specialCharacters: 'Allowed',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TEST SCENARIOS COVERED
// ═══════════════════════════════════════════════════════════════════════════

const TestScenarios = {
  'Valid Credentials': {
    endpoint: 'POST /api/login',
    request: { email: 'user@example.com', password: 'password123' },
    expectedStatus: [200, 201],
    expectedResponse: 'success: true',
    description: 'AC1: Valid credentials should authenticate user',
  },

  'Invalid Password': {
    endpoint: 'POST /api/login',
    request: { email: 'user@example.com', password: 'wrongpassword' },
    expectedStatus: [401, 422],
    expectedResponse: 'error: true',
    description: 'AC2: Invalid credentials show error',
  },

  'Non-existent Email': {
    endpoint: 'POST /api/login',
    request: { email: 'nonexistent@example.com', password: 'password123' },
    expectedStatus: [401, 404],
    expectedResponse: 'error: true',
    description: 'Non-existent user should return error',
  },

  'Missing Email': {
    endpoint: 'POST /api/login',
    request: { password: 'password123' },
    expectedStatus: [400, 422],
    expectedResponse: 'error: true, errors.email present',
    description: 'AC3: Required email field missing',
  },

  'Missing Password': {
    endpoint: 'POST /api/login',
    request: { email: 'user@example.com' },
    expectedStatus: [400, 422],
    expectedResponse: 'error: true, errors.password present',
    description: 'AC3: Required password field missing',
  },

  'Empty Email': {
    endpoint: 'POST /api/login',
    request: { email: '', password: 'password123' },
    expectedStatus: [400, 422],
    expectedResponse: 'error: true',
    description: 'AC3: Empty email field validation',
  },

  'Empty Password': {
    endpoint: 'POST /api/login',
    request: { email: 'user@example.com', password: '' },
    expectedStatus: [400, 422],
    expectedResponse: 'error: true',
    description: 'AC3: Empty password field validation',
  },

  'Invalid Email Format': {
    endpoint: 'POST /api/login',
    request: { email: 'invalidemail@test', password: 'password123' },
    expectedStatus: [400, 422],
    expectedResponse: 'error: true',
    description: 'Email format validation error',
  },

  'Wrong HTTP Method': {
    endpoint: 'GET /api/login',
    expectedStatus: [400, 405],
    expectedResponse: 'error or method not allowed',
    description: 'Login should not accept GET requests',
  },

  'Valid Login with Whitespace': {
    endpoint: 'POST /api/login',
    request: { email: '  user@example.com  ', password: 'password123' },
    expectedStatus: [200, 201, 400],
    expectedResponse: 'Should trim and process or reject',
    description: 'Whitespace handling in email',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ACCEPTANCE CRITERIA MAPPING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * AC1: Login form is available at "Signup / Login"
 * Test Evidence:
 *   - API-TC-01: Valid credentials endpoint exists and responds
 *   - HTTP 200/201: Endpoint is accessible
 * 
 * AC2: Valid credentials log user into the application
 * Test Evidence:
 *   - API-TC-01: Valid request returns success (200/201)
 *   - API-TC-02: No error field in success response
 * 
 * AC3: Invalid credentials show error
 * Test Evidence:
 *   - API-TC-03: Wrong password returns 401/error
 *   - API-TC-04: Non-existent email returns 401/404/error
 *   - API-TC-05: Error response contains error message
 * 
 * AC4: Empty fields show validation warnings
 * Test Evidence:
 *   - API-TC-06: Missing email returns 400/validation error
 *   - API-TC-07: Missing password returns 400/validation error
 *   - API-TC-08: Both fields missing returns validation error
 *   - API-TC-09: Empty email returns 400/validation error
 *   - API-TC-10: Empty password returns 400/validation error
 *   - API-TC-11: Both empty returns validation error
 */

// ═══════════════════════════════════════════════════════════════════════════
// HTTP STATUS CODE REFERENCE
// ═══════════════════════════════════════════════════════════════════════════

const StatusCodes = {
  200: 'OK - Login successful',
  201: 'Created - Session/token created',
  301: 'Moved Permanently - Redirect',
  302: 'Found - Redirect',
  400: 'Bad Request - Validation error (missing/invalid fields)',
  401: 'Unauthorized - Invalid credentials',
  404: 'Not Found - User not found',
  405: 'Method Not Allowed - Wrong HTTP method',
  422: 'Unprocessable Entity - Semantic validation error',
  500: 'Internal Server Error - Server error',
};

// ═══════════════════════════════════════════════════════════════════════════
// ENVIRONMENT VARIABLES REQUIRED FOR TESTING
// ═══════════════════════════════════════════════════════════════════════════

export const RequiredEnvVars = {
  'AE_URL': 'Base URL of Automation Exercise app (default: https://automationexercise.com)',
  'USER_EMAIL': 'Valid test user email for authentication',
  'USER_PASSWORD': 'Valid test user password for authentication',
  'VALID_LOGIN_EMAIL': 'Alternative: valid login email',
  'VALID_LOGIN_PASSWORD': 'Alternative: valid login password',
};

// ═══════════════════════════════════════════════════════════════════════════
// RUNNING THE TESTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Command to run API tests:
 * 
 * npx playwright test tests/api/SCRUM-5.api.spec.ts
 * 
 * Command to run with specific project:
 * 
 * npx playwright test tests/api/SCRUM-5.api.spec.ts --project=chromium
 * 
 * Command to run specific test:
 * 
 * npx playwright test tests/api/SCRUM-5.api.spec.ts -g "Valid credentials"
 * 
 * Command with headed mode (debug):
 * 
 * npx playwright test tests/api/SCRUM-5.api.spec.ts --headed
 * 
 * Command to show report:
 * 
 * npx playwright show-report
 */

export default TestScenarios;
