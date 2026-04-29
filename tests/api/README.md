# SCRUM-5 API Tests

## Overview

This directory contains API test scripts for SCRUM-5 - User Login Authentication functionality. These tests verify the login endpoint behavior using Playwright's API testing capabilities.

## Files Included

### 1. **SCRUM-5.api.spec.ts** 
Main API test suite with 19 comprehensive test cases covering:
- ✅ Valid credentials authentication (success path)
- ❌ Invalid credentials (error path)
- ⚠️ Missing/empty field validation
- 📝 Email format validation
- 🔍 Request/response format verification
- 🛡️ Security and edge cases

#### Test Cases:
| ID | Coverage | Expected |
|----|----------|----------|
| API-TC-01 | Valid credentials success | 200/201 + token |
| API-TC-02 | No error in success response | success: true |
| API-TC-03 | Invalid password error | 400/401/422 |
| API-TC-04 | Non-existent user error | 400/401/404 |
| API-TC-05 | Error contains message | error message |
| API-TC-06 | Missing email field | 400/422 |
| API-TC-07 | Missing password field | 400/422 |
| API-TC-08 | Both fields missing | 400/422 |
| API-TC-09 | Empty email string | 400/422 |
| API-TC-10 | Empty password string | 400/422 |
| API-TC-11 | Both fields empty | 400/422 |
| API-TC-12 | Invalid email format | 400/422 |
| API-TC-13 | Missing @ symbol in email | 400/422 |
| API-TC-14 | Response structure validation | Object with fields |
| API-TC-15 | Whitespace trimming | Handled |
| API-TC-16 | Very long email | Valid response |
| API-TC-17 | Special chars in password | Accepted |
| API-TC-18 | GET method not allowed | 4xx/5xx |
| API-TC-19 | Content-Type header | JSON/HTML |

### 2. **SCRUM-5.api.contract.ts**
API contract documentation defining:
- Request/response interfaces (TypeScript types)
- Endpoint specification with examples
- Validation rules
- HTTP status codes
- SCRUM acceptance criteria mapping
- Environment variable requirements
- Commands to run tests

## Acceptance Criteria Mapping

| AC | Test Coverage | Evidence |
|----|-------|----------|
| AC1: Login form available | API-TC-01 | Endpoint responds successfully |
| AC2: Valid credentials auth | API-TC-01, API-TC-02 | 200/201 response + no error |
| AC3: Invalid credentials error | API-TC-03, API-TC-04, API-TC-05 | 401/404 + error message |
| AC4: Empty fields validation | API-TC-06 to API-TC-11 | 400/422 validation errors |

## Environment Variables

The API tests use the following environment variables (with fallbacks):

```bash
# Primary variables
USER_EMAIL              # Valid test user email
USER_PASSWORD           # Valid test user password

# Fallback variables
VALID_LOGIN_EMAIL       # Alternative email variable
VALID_LOGIN_PASSWORD    # Alternative password variable

# Application URL
AE_URL                  # Application base URL (default: https://automationexercise.com)
```

## Running the Tests

### Run all API tests:
```bash
npx playwright test tests/api/SCRUM-5.api.spec.ts --project=api
```

### Run specific test:
```bash
npx playwright test tests/api/SCRUM-5.api.spec.ts --project=api -g "Valid credentials"
```

### Run with detailed output:
```bash
npx playwright test tests/api/SCRUM-5.api.spec.ts --project=api --verbose
```

### Show test report:
```bash
npx playwright show-report
```

## API Endpoint Expected Contract

### Endpoint
```
POST /api/login
Content-Type: application/json
```

### Success Response (200/201)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "message": "Login successful"
}
```

### Error Response (401)
```json
{
  "error": true,
  "message": "Invalid credentials"
}
```

### Validation Error Response (400/422)
```json
{
  "error": true,
  "message": "Validation failed",
  "errors": {
    "email": ["Email is required"],
    "password": ["Password is required"]
  }
}
```

## Important Notes

⚠️ **Current Status**: 
- automationexercise.com appears to be a UI-focused testing site without dedicated API endpoints
- The `/api/login` endpoint may not exist on this platform
- These tests are designed to work with any login API that follows RESTful conventions

💡 **Adaptions Needed**:
1. Update `LOGIN_ENDPOINT` constant if the actual endpoint differs:
   ```typescript
   const LOGIN_ENDPOINT = '/your-actual-endpoint'; // e.g., '/auth/login', '/user/login'
   ```

2. Update request/response format if the API uses different field names:
   ```typescript
   // If API uses different field names:
   data: {
     username: email,  // instead of email
     pwd: password     // instead of password
   }
   ```

3. Add authentication headers if needed:
   ```typescript
   await request.post(LOGIN_ENDPOINT, {
     headers: {
       'Authorization': 'Bearer token'
     },
     data: { ... }
   });
   ```

## Expected Issues & Resolutions

### Issue: Tests receive 404 response
**Reason**: `/api/login` endpoint doesn't exist  
**Solution**: Check actual API documentation for correct endpoint path

### Issue: Tests timeout
**Reason**: Network latency or API unresponsiveness  
**Solution**: Increase timeout in playwright.config.ts or specific test

### Issue: Endpoint requires headers
**Reason**: API requires authentication or specific headers  
**Solution**: Add headers to `playwright.request.newContext()` in beforeAll

## Test Structure Best Practices Used

This API test suite demonstrates:

✅ **Setup/Teardown**: beforeAll/afterAll for resource management  
✅ **Flexible Assertions**: Handle multiple valid response formats  
✅ **Error Handling**: `.catch()` for optional response parsing  
✅ **Environment Safety**: Fallback credentials with no hard-coded secrets  
✅ **Clear Naming**: Test names match acceptance criteria  
✅ **Documentation**: Comments explain each validation  
✅ **HTTP Semantics**: Correct status codes in assertions  
✅ **Coverage**: Positive, negative, and edge cases  

## Integration with CI/CD

The API tests are configured in `playwright.config.ts`:

```typescript
{
  name: 'api',
  testDir: './tests/api',
  use: {
    baseURL: process.env.AE_URL || 'https://automationexercise.com',
  },
}
```

### Run in Jenkins/CI:
```bash
npx playwright test --project=api
```

## Next Steps

1. **Verify Endpoint**: Confirm the actual login API endpoint URL
2. **Update Constants**: Modify LOGIN_ENDPOINT in test file
3. **Run Tests**: Execute API tests against real endpoint
4. **Adjust Response Handling**: Update assertions based on actual API responses
5. **Add More Scenarios**: Include rate limiting, concurrent requests, etc.

## Related Files

- **UI Tests**: `tests/stage/auth/SCRUM-5.spec.ts` (Playwright UI automation)
- **Page Objects**: `pages/stage/aeLoginPage.ts` (UI interaction helpers)
- **Config**: `playwright.config.ts` (Playwright configuration)
- **Contract**: `tests/api/SCRUM-5.api.contract.ts` (API specification)

## Support

For issues or questions:
1. Check the API contract documentation in `SCRUM-5.api.contract.ts`
2. Review console output for actual API responses
3. Verify environment variables are set correctly
4. Confirm API endpoint is accessible
