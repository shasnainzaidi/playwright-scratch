# SCRUM-4 Test Implementation Summary

## Overview
This document describes the automated and manual test cases created for SCRUM-4: User Registration feature on Automation Exercise (https://automationexercise.com).

---

## Test Structure

### 1. **Page Object Layer** (`pages/stage/`)

#### **aeRegisterPage.ts** (Enhanced)
- **Purpose:** Encapsulates all signup and account creation page interactions
- **Locators:** All data-qa attributes for signup form, account details form, and error messages
- **Key Methods:**
  - `goto()` - Navigate to /login page
  - `fillSignupName()` - Enter name in signup form
  - `fillSignupEmail()` - Enter email in signup form
  - `submitSignup()` - Submit signup form
  - `signupWithNameAndEmail()` - Combined signup action
  - `fillAccountDetails()` - Fill complete account information
  - `submitCreateAccount()` - Create account
  - `completeSignupFlow()` - End-to-end signup
  - `logout()` - Logout user
  
- **Assertions:**
  - `expectAccountCreated()` - Verify success message
  - `expectEmailExistsError()` - Verify duplicate email error
  - `expectSignupFormVisible()` - Form elements visible
  - `expectAccountDetailsFormVisible()` - Account form visible
  - `expectInvalidEmailError()` - Invalid email error
  - `expectNameFieldRequired()` - Name validation
  - `expectEmailFieldRequired()` - Email validation
  - `getEmailErrorMessage()` - Get validation message
  - `getFormErrorMessages()` - Get all error messages

#### **aeHomePage.ts** (Existing)
- Used to navigate from homepage and verify page loads

#### **aeLoginPage.ts** (Existing)
- Used for login testing (AC6)

---

### 2. **Test Data Layer** (`test-data/`)

#### **signupData.ts** (New)
Comprehensive test data including:
- **validSignupData:** Multiple valid scenario datasets (standard, special chars, long names, etc.)
- **invalidEmailFormats:** Array of invalid email formats
- **securityTestData:** XSS, SQL injection test strings
- **edgeCaseData:** Single char, very long, unicode, numbers
- **countryData:** Valid country/state combinations
- **duplicateEmail:** From environment variable (AE_EMAIL)

---

### 3. **Automated Test Layer** (`tests/stage/auth/`)

#### **signup.spec.ts** (New)
**Total Test Cases:** 40+

**Test Organization by Acceptance Criteria:**

##### **AC1: Signup Form Display (3 tests)**
- Form displays on Signup/Login click
- All required fields visible
- Field placeholders correct

##### **AC2: Valid Data Acceptance (4 tests)**
- Standard valid signup with all fields
- Special characters in name (apostrophe, hyphen)
- Long name edge case (45+ characters)
- Minimum data submission

##### **AC3: Invalid Email Prevention (5 tests)**
- Missing @ symbol
- Missing local part
- Missing domain extension
- Spaces in email
- Form submission disabled with invalid data

##### **AC4: Duplicate Email Error (3 tests)**
- Duplicate email shows error
- Error message content verification
- Multiple duplicate attempts

##### **AC5: Successful Redirect (2 tests)**
- Redirect to account/success page after signup
- Success message displays with account created heading

##### **AC6: Login with New Credentials (2 tests)**
- Login with newly registered credentials
- Verify redirect to account page on login
- Verify correct user is logged in

##### **Additional Coverage (15+ tests)**
- Required field validation (name, email)
- XSS prevention
- SQL injection prevention
- Form state reset on refresh
- Form accessibility after errors
- Password login failure scenarios
- Non-existent email handling

---

### 4. **Manual Test Cases** (`tests/stage/`)

#### **SCRUM-4-Manual-Test-Cases.md** (New)
**Comprehensive manual testing document with:**

**Test Cases by Acceptance Criteria:**
- AC1: 3 test cases (form display, fields verification, accessibility)
- AC2: 4 test cases (standard, special chars, long names, minimum data)
- AC3: 5 test cases (various invalid email formats)
- AC4: 2 test cases (duplicate email, error message verification)
- AC5: 3 test cases (redirect verification, logged-in status, success message)
- AC6: 4 test cases (login successful, redirect, wrong password, non-existent email)

**Additional Sections:**
- Security Tests (XSS, SQL Injection, data exposure)
- Edge Cases (form state, refresh, back button, multiple attempts)
- Test Summary table with pass/fail tracking
- Sign-off section for tester documentation

---

## Environment Configuration

### **.env Variables Used**
```
AE_URL=https://automationexercise.com
AE_EMAIL=hasnain.contour@gmail.com (for duplicate email testing)
AE_PASSWORD=qwerty10 (if login needed)
```

### **Playwright Configuration**
- **Base URL:** Configured in `playwright.config.ts`
- **Project:** Can run as `stage` or other projects
- **Screenshots:** On failure only
- **Video:** Retained on failure
- **Trace:** On first retry

---

## Running the Tests

### **Run All Signup Tests**
```bash
npx playwright test tests/stage/auth/signup.spec.ts
```

### **Run by Tag**
```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run only critical tests
npx playwright test --grep @critical

# Run regression tests
npx playwright test --grep @regression
```

### **Run Single Test Case**
```bash
npx playwright test -g "AC1 - Signup form is displayed"
```

### **Run in Headed Mode (see browser)**
```bash
npx playwright test tests/stage/auth/signup.spec.ts --headed
```

### **Run Specific Project**
```bash
npx playwright test tests/stage/auth/signup.spec.ts --project=stage-chromium
```

### **Generate Report**
```bash
npx playwright test tests/stage/auth/signup.spec.ts
npx playwright show-report
```

---

## Test Coverage Summary

| Acceptance Criteria | Automated Tests | Manual Tests | Coverage |
|---|---|---|---|
| AC1: Form Display | 3 | 3 | ✓ Complete |
| AC2: Valid Data | 4 | 4 | ✓ Complete |
| AC3: Invalid Email | 5 | 5 | ✓ Complete |
| AC4: Duplicate Email | 3 | 2 | ✓ Complete |
| AC5: Success Redirect | 2 | 3 | ✓ Complete |
| AC6: Login Credentials | 2 | 4 | ✓ Complete |
| Security | 3+ | 3 | ✓ Complete |
| Edge Cases | 8+ | 4 | ✓ Complete |

**Total Automated Tests:** 40+  
**Total Manual Tests:** 26  
**Overall Coverage:** ✓ All Acceptance Criteria Covered

---

## Test Data Characteristics

### **Dynamic Email Generation**
- Uses timestamp to generate unique emails: `autotest.${timestamp}@test.com`
- Ensures tests can be run multiple times without conflicts
- Prevents duplicate email constraint violations

### **Environment-Based Data**
- Duplicate email from `AE_EMAIL` environment variable
- Base URL from `AE_URL` environment variable
- Secure password from environment (not hardcoded for sensitive data)

### **Comprehensive Scenarios**
- Standard ASCII names
- International characters (accents, apostrophes)
- Names exceeding typical length limits
- Edge cases (single char, very long)
- XSS attempts (script tags, event handlers)
- SQL injection patterns

---

## Key Features

### **Best Practices Implemented**
✓ Page Object Model pattern  
✓ Test data externalized and reusable  
✓ Clear test descriptions matching acceptance criteria  
✓ Proper waits and async handling  
✓ Environment variable usage for sensitive data  
✓ Tag-based test organization (@smoke, @critical, @regression)  
✓ Screenshot/video capture on failures  
✓ Comprehensive error assertions  
✓ Security-focused negative tests  

### **Test Quality Indicators**
- **Isolation:** Each test is independent
- **Repeatability:** Tests can run multiple times
- **Maintainability:** Page objects centralize selectors
- **Readability:** Clear test names and steps
- **Coverage:** All AC criteria covered multiple ways
- **Reliability:** Proper wait states and error handling

---

## Manual Testing Checklist

For manual testers using `SCRUM-4-Manual-Test-Cases.md`:

1. ✓ Navigate to test environment (AE_URL)
2. ✓ Follow step-by-step instructions for each test case
3. ✓ Record actual results vs expected results
4. ✓ Note any deviations or bugs
5. ✓ Mark pass/fail for each test
6. ✓ Sign off with tester name and date
7. ✓ Track overall pass rate
8. ✓ Document any known issues

---

## Common Issues & Solutions

### **Issue: "Email already exists" even with unique email?**
- Check timestamp is actually changing
- Clear browser cache and cookies
- Verify using different email domain

### **Issue: Tests timing out?**
- Increase `waitForLoadState()` timeout
- Check network connectivity
- Verify AE_URL is accessible

### **Issue: Can't find locators?**
- Use Playwright Inspector: `npx playwright codegen https://automationexercise.com`
- Verify data-qa attributes still exist on website
- Check for page structure changes

### **Issue: Duplicate account creation?**
- This is expected - tests create new accounts each run
- Use unique timestamps to prevent conflicts
- Clean up test data after test completion if needed

---

## Files Created/Modified

### **Created Files:**
```
✓ tests/stage/auth/signup.spec.ts (40+ test cases)
✓ tests/stage/SCRUM-4-Manual-Test-Cases.md (26 manual tests)
✓ test-data/signupData.ts (comprehensive test data)
```

### **Enhanced Files:**
```
✓ pages/stage/aeRegisterPage.ts (added methods & assertions)
```

### **Existing Files Used:**
```
✓ pages/stage/aeHomePage.ts
✓ pages/stage/aeLoginPage.ts
✓ .env (AE_URL, AE_EMAIL)
```

---

## Next Steps

1. **Review automated tests** in `tests/stage/auth/signup.spec.ts`
2. **Execute manual tests** using `SCRUM-4-Manual-Test-Cases.md`
3. **Update test data** if website structure changes
4. **Monitor test results** in CI/CD pipeline
5. **Report issues** with screenshots from test failures
6. **Maintain documentation** as features evolve

---

## Contact & Support

For questions about:
- **Test execution:** Refer to "Running the Tests" section
- **Test data:** Check `test-data/signupData.ts`
- **Page objects:** Check `pages/stage/aeRegisterPage.ts`
- **Manual testing:** Refer to `SCRUM-4-Manual-Test-Cases.md`
- **Environment setup:** Check `.env` and `playwright.config.ts`

---

**Generated:** March 30, 2026  
**Test Framework:** Playwright + TypeScript  
**Environment:** Automation Exercise (https://automationexercise.com)  
**Story:** SCRUM-4 - User Registration
