# SCRUM-4: User Registration - Automated & Manual Test Cases

## 📋 Quick Start

This folder contains comprehensive automated and manual test cases for **SCRUM-4: User Registration** feature on **Automation Exercise** (https://automationexercise.com).

### Files Overview

| File | Type | Purpose |
|------|------|---------|
| `auth/signup.spec.ts` | Automated | 40+ Playwright test cases covering all acceptance criteria |
| `SCRUM-4-Manual-Test-Cases.md` | Manual | 26 detailed manual test cases with step-by-step instructions |
| `SCRUM-4-TEST-IMPLEMENTATION.md` | Documentation | Complete test implementation guide and reference |
| `../pages/stage/aeRegisterPage.ts` | Page Object | All signup page locators and actions |
| `../../test-data/signupData.ts` | Test Data | Reusable test data for all scenarios |

---

## 🚀 Running Automated Tests

### Quick Start
```bash
# Run all signup tests
npx playwright test tests/stage/auth/signup.spec.ts

# Run with specific tag
npx playwright test --grep @critical
npx playwright test --grep @smoke
npx playwright test --grep @regression

# Run in headed mode (see browser)
npx playwright test tests/stage/auth/signup.spec.ts --headed

# Show test report
npx playwright show-report
```

### Test Tags
- `@smoke` - Quick sanity tests (3 tests)
- `@critical` - Must-have functionality (18 tests)
- `@regression` - Edge cases & security (15+ tests)

---

## 📝 Running Manual Tests

1. Open `SCRUM-4-Manual-Test-Cases.md`
2. Navigate to https://automationexercise.com
3. Follow test cases step-by-step
4. Record results in the manual test document
5. Sign off when complete

---

## ✅ Acceptance Criteria Coverage

All 6 acceptance criteria are covered:

| AC | Automated Tests | Manual Tests | Notes |
|----|---|---|---|
| **AC1** - Form Display | 3 | 3 | Signup form appears on login click |
| **AC2** - Valid Data | 4 | 4 | Accept all valid inputs (standard, special chars, long names) |
| **AC3** - Invalid Email | 5 | 5 | Prevent invalid email formats |
| **AC4** - Duplicate Email | 3 | 2 | Show error for duplicate emails |
| **AC5** - Success Redirect | 2 | 3 | Redirect & success message on account creation |
| **AC6** - Login Credentials | 2 | 4 | User can login with newly created account |

**Total Coverage:** ✅ 100%

---

## 🏗️ Architecture

### Page Objects
```
pages/stage/
  ├── aeRegisterPage.ts (Enhanced for SCRUM-4)
  ├── aeHomePage.ts
  └── aeLoginPage.ts
```

### Test Specs
```
tests/stage/auth/
  └── signup.spec.ts (40+ tests)
```

### Test Data
```
test-data/
  └── signupData.ts (Reusable test data)
```

### Documentation
```
tests/stage/
  ├── SCRUM-4-Manual-Test-Cases.md
  └── SCRUM-4-TEST-IMPLEMENTATION.md
```

---

## 🔑 Environment Configuration

Uses the following environment variables from `.env`:

| Variable | Usage | Example |
|----------|-------|---------|
| `AE_URL` | Base URL for all tests | https://automationexercise.com |
| `AE_EMAIL` | Duplicate email testing | hasnain.contour@gmail.com |
| `AE_PASSWORD` | Login testing (if needed) | qwerty10 |

---

## 📊 Test Statistics

### Automated Tests (signup.spec.ts)
- **Total Test Cases:** 40+
- **Execution Time:** ~5-8 minutes (parallel)
- **Coverage:** 
  - Acceptance Criteria: 100%
  - Happy Path: ✓
  - Negative Path: ✓
  - Edge Cases: ✓
  - Security: ✓

### Manual Tests (SCRUM-4-Manual-Test-Cases.md)
- **Total Test Cases:** 26
- **Estimated Time:** 45-60 minutes
- **Coverage:**
  - Acceptance Criteria: 100%
  - Happy Path: ✓
  - Negative Path: ✓
  - Edge Cases: ✓
  - Security: ✓

---

## 🎯 Test Scenarios Covered

### Happy Path ✓
- Standard signup with valid data
- Complete account creation flow
- Login with newly created credentials
- Successful redirect to account page

### Negative Path ✓
- Invalid email formats (5 variations)
- Duplicate email error
- Empty required fields
- Wrong login credentials

### Edge Cases ✓
- Special characters in name (é, ñ, ö, etc.)
- Long names (45+ characters)
- Single character names
- Name with numbers and special symbols
- Form refresh during signup
- Back button navigation
- Multiple signup attempts with same email

### Security ✓
- XSS prevention (script injection)
- SQL injection prevention
- No sensitive data exposure
- Password field protection
- CSRF protection (if applicable)

---

## 🐛 Debugging Failed Tests

### Common Issues

**Test Timeout?**
```bash
# Increase timeout
npx playwright test --timeout=60000
```

**Can't find element?**
```bash
# Launch inspector to find correct selector
npx playwright codegen https://automationexercise.com/login
```

**Environment variables not loading?**
```bash
# Verify .env file exists and contains:
AE_URL=https://automationexercise.com
AE_EMAIL=hasnain.contour@gmail.com
```

**Tests passing individually but failing in batch?**
```bash
# Reset database/clear test accounts between runs
# Or use unique timestamps for email generation (already implemented)
```

---

## 📚 Detailed Documentation

For comprehensive information, see **SCRUM-4-TEST-IMPLEMENTATION.md**:
- Full test case descriptions
- Step-by-step instructions
- Expected vs actual results
- Environment setup
- CI/CD integration guide
- Troubleshooting guide

---

## 🔄 Continuous Integration

### Add to CI/CD Pipeline
```yaml
- name: Run SCRUM-4 Tests
  run: npx playwright test tests/stage/auth/signup.spec.ts
  
- name: Publish Report
  uses: actions/upload-artifact@v2
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

---

## ✨ Key Features

✅ **Page Object Model** - Maintainable, reusable code  
✅ **Data-Driven Tests** - Externalized test data  
✅ **Clear Naming** - Easy to understand test intent  
✅ **Tag Organization** - Run specific test categories  
✅ **Error Messaging** - Detailed assertion messages  
✅ **Async Handling** - Proper waits and timeouts  
✅ **Security Tests** - XSS, SQL injection prevention  
✅ **Screenshots** - Automatic failure captures  
✅ **Video Recording** - On-failure video traces  
✅ **Test Report** - HTML report generation  

---

## 📞 Support & Questions

| Question | Answer |
|----------|--------|
| How do I run tests? | See "Running Automated Tests" section |
| Where's the test data? | See `test-data/signupData.ts` |
| How do I add new tests? | Follow pattern in `signup.spec.ts` |
| Where are manual tests? | See `SCRUM-4-Manual-Test-Cases.md` |
| How do I debug a test? | Use `--headed` flag and Playwright Inspector |
| Can I run on different browsers? | Yes, configure in `playwright.config.ts` |
| How do I view test results? | Run `npx playwright show-report` |

---

## 📅 Test Maintenance

### Regular Updates Needed
- Update locators if website HTML changes
- Add new test data for new scenarios
- Review manual tests quarterly
- Update documentation as features evolve

### Version Info
- **Framework:** Playwright 1.58.2
- **Language:** TypeScript 5.9.3
- **Node:** 18+
- **Date Created:** March 30, 2026

---

## 🎓 Learning Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Configuration](https://playwright.dev/docs/test-configuration)

---

## License & Credits

**Story:** SCRUM-4 - User Registration  
**Environment:** Automation Exercise (automationexercise.com)  
**Test Framework:** Playwright + TypeScript  
**Created:** March 30, 2026  

---

**Ready to test! 🚀**

Start with:
```bash
npx playwright test tests/stage/auth/signup.spec.ts --headed
```
