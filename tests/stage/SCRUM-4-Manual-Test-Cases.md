# SCRUM-4 Manual Test Cases - User Registration

**Story:** As a new user, I want to register an account so that I can access personalized features and make purchases on the site.

**Test Environment:** AE_URL = https://automationexercise.com  
**Date:** March 30, 2026  
**Test Type:** Manual Functional Testing

---

## Preconditions
- ✓ User is on the homepage (https://automationexercise.com/)
- ✓ User is not already logged in
- ✓ No existing account with the same email
- ✓ Browser: Chrome/Firefox/Safari/Edge (latest version)
- ✓ JavaScript enabled
- ✓ Cookies enabled

---

## Test Cases by Acceptance Criteria

### AC1: Signup Form Display

#### TC1.1: Signup/Login button navigates to signup form
**Steps:**
1. Navigate to https://automationexercise.com/
2. Look for "Signup / Login" link/button in the header/navigation
3. Click on "Signup / Login"

**Expected Result:**
- Page navigates to login page (/login)
- Signup form is visible on the left side
- Signup form contains following fields:
  - Name input field
  - Email Address input field
  - Signup button

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC1.2: Verify signup form contains all required input fields
**Steps:**
1. Navigate to https://automationexercise.com/login
2. Locate the signup form

**Expected Result:**
- Name field (placeholder: "Name") is visible and focusable
- Email Address field (placeholder: "Email Address") is visible and focusable
- Signup button is visible and enabled
- All fields are properly labeled

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC1.3: Verify form styling and accessibility
**Steps:**
1. Navigate to https://automationexercise.com/login
2. Examine the signup form layout

**Expected Result:**
- Form is clearly visible and not hidden behind other elements
- Form is responsive on desktop, tablet, and mobile views
- Input fields are clearly distinguishable
- Signup button is prominent and accessible

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

### AC2: Form Accepts Valid User Data

#### TC2.1: Complete signup with valid data (standard case)
**Steps:**
1. Navigate to https://automationexercise.com/login
2. In the signup form, enter:
   - Name: "John Automation Test"
   - Email: "autotest_[TIMESTAMP]@test.com" (use unique timestamp)
   - Click Signup button
3. On the next page, fill account details:
   - Title: Mr or other available option
   - Password: "SecurePass123!"
   - Date of Birth: Select from dropdowns (e.g., 15, March, 1990)
   - First Name: "John"
   - Last Name: "Automation"
   - Company: [Leave blank or fill if required]
   - Address: "123 Test Street"
   - Country: "United States"
   - State: "New York"
   - City: "New York"
   - Zipcode: "10001"
   - Mobile: "+12125551234"
4. Click "Create Account" button

**Expected Result:**
- After clicking Signup, account details form appears
- All fields accept input correctly
- No validation errors for valid data
- After clicking Create Account, page navigates to success page
- Success page displays "Account Created" message
- User is now logged in (logout option visible)

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC2.2: Signup with name containing special characters
**Steps:**
1. Navigate to https://automationexercise.com/login
2. In the signup form, enter:
   - Name: "Mary O'Brien-Smith Jr."
   - Email: "special_[TIMESTAMP]@test.com"
   - Click Signup button
3. Fill remaining account details with valid data
4. Click "Create Account"

**Expected Result:**
- Special characters (apostrophe, hyphen) are accepted in name field
- Account is created successfully
- Success message displays with account created
- User is logged in

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC2.3: Signup with long name (edge case)
**Steps:**
1. Navigate to https://automationexercise.com/login
2. In the signup form, enter:
   - Name: "Alexander Christopher Montgomery III Esquire" (45+ characters)
   - Email: "longname_[TIMESTAMP]@test.com"
   - Click Signup button
3. Fill remaining account details with valid data
4. Click "Create Account"

**Expected Result:**
- Long name (45+ characters) is accepted
- No truncation or cutting off of name in database
- Account created successfully
- Name displays correctly in account page

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC2.4: Signup with minimum valid data
**Steps:**
1. Navigate to https://automationexercise.com/login
2. In the signup form, enter:
   - Name: "A" (single character)
   - Email: "a_[TIMESTAMP]@a.com"
   - Click Signup button
3. Fill remaining account details with valid data
4. Click "Create Account"

**Expected Result:**
- Minimum length data is accepted
- Account is created successfully
- No error messages

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

### AC3: Invalid Email Format Prevents Form Submission

#### TC3.1: Email without @ symbol
**Steps:**
1. Navigate to https://automationexercise.com/login
2. In the signup form, enter:
   - Name: "Test User"
   - Email: "notanemail.com"
   - Attempt to click Signup button

**Expected Result:**
- Email field shows validation error (red border or error message)
- Signup button is disabled or click has no effect
- Form does not submit
- Error message displays: "Please include an '@' in the email address"

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC3.2: Email with missing local part
**Steps:**
1. Navigate to https://automationexercise.com/login
2. In the signup form, enter:
   - Name: "Test User"
   - Email: "@domain.com"
   - Attempt to click Signup button

**Expected Result:**
- Email field shows validation error
- Signup button is disabled or click has no effect
- Form does not submit
- Error message displays indicating invalid email format

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC3.3: Email with spaces
**Steps:**
1. Navigate to https://automationexercise.com/login
2. In the signup form, enter:
   - Name: "Test User"
   - Email: "user name@test.com"
   - Attempt to click Signup button

**Expected Result:**
- Email field shows validation error
- Form does not submit
- Error message indicates invalid email format

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC3.4: Email missing domain extension
**Steps:**
1. Navigate to https://automationexercise.com/login
2. In the signup form, enter:
   - Name: "Test User"
   - Email: "test@nodomain"
   - Attempt to click Signup button

**Expected Result:**
- Email field shows validation error
- Form does not submit
- Error message indicates invalid email format

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC3.5: Email missing domain completely
**Steps:**
1. Navigate to https://automationexercise.com/login
2. In the signup form, enter:
   - Name: "Test User"
   - Email: "user@"
   - Attempt to click Signup button

**Expected Result:**
- Email field shows validation error
- Form does not submit

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

### AC4: Duplicate Email Shows Appropriate Error

#### TC4.1: Signup with existing email
**Steps:**
1. Navigate to https://automationexercise.com/login
2. In the signup form, enter:
   - Name: "Duplicate Test"
   - Email: "hasnain.contour@gmail.com" (existing account email)
   - Click Signup button

**Expected Result:**
- Error message displays: "Email Address already exist!"
- Error message is clearly visible (red text, alert box, or similar)
- Form remains on signup page (no navigation)
- User can attempt signup again with different email
- Form fields retain their values for correction

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC4.2: Verify error message content for duplicate email
**Steps:**
1. Navigate to https://automationexercise.com/login
2. Enter duplicate email from TC4.1
3. Click Signup button
4. Read and record the error message text

**Expected Result:**
- Error message contains words: "Email", "already", "exist"
- Error message is professional and user-friendly
- Message clearly indicates the email is already registered
- Message may suggest: "Try logging in instead" or similar helpful text

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

### AC5: Successful Signup Redirects to Account Page or Displays Welcome Message

#### TC5.1: Verify redirect after successful account creation
**Steps:**
1. Navigate to https://automationexercise.com/login
2. Complete signup and account creation (TC2.1)
3. Observe the URL and page content after clicking "Create Account"

**Expected Result:**
- URL changes from /login to account-related page (e.g., /account, /dashboard, /home)
- Page displays "Account Created!" heading or similar success message
- Success message is prominent and visible
- Message may include: "Congratulations!" or "Welcome [Name]"
- Continue or Home button is provided

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC5.2: Verify user is logged in after signup
**Steps:**
1. Complete signup and account creation (TC2.1)
2. After seeing success message, check navigation bar
3. Look for username or logout option

**Expected Result:**
- Logout option appears in navigation (not Login)
- Username or "Logged in as [Name]" message appears
- User avatar or profile icon may be displayed
- User has access to account/dashboard pages
- User is immediately logged in without additional login step

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC5.3: Success message displays all relevant information
**Steps:**
1. Complete signup and account creation (TC2.1)
2. Examine the success message thoroughly

**Expected Result:**
- Message clearly states account was created successfully
- Message may display the registered email address
- Message may display confirmation that email was sent (if applicable)
- Message includes next steps (e.g., "Continue Shopping", "View Account")
- Message is not placed behind other page elements
- Message is mobile-responsive

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

### AC6: User Can Login with Newly Registered Credentials

#### TC6.1: Login with newly created account credentials
**Steps:**
1. Create new account using TC2.1 with unique email
2. Note the email and password used
3. Click Continue or Home button on success page
4. Click Logout
5. Verify logged out (Login option in navigation)
6. Click Login / Signup
7. In the login form (right side), enter:
   - Email: [email used in step 1]
   - Password: [password used in step 1]
   - Click Login button

**Expected Result:**
- Login form accepts the credentials
- User is successfully logged in
- Page navigates to account/dashboard
- Username or "Logged in as" message appears
- No error messages
- Logout option is available

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC6.2: Verify login redirects to account page
**Steps:**
1. Create new account and logout (TC6.1)
2. Login with newly created credentials
3. Observe URL and page content

**Expected Result:**
- URL changes to account/dashboard page (/account, /dashboard, /profile, etc.)
- Page displays account information (email, name, etc.)
- Page is not the login page anymore
- User can access personalized features

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC6.3: Login with incorrect password fails
**Steps:**
1. Create new account using TC2.1
2. Logout
3. Attempt to login with:
   - Correct email
   - Incorrect password (e.g., "WrongPassword123!")
   - Click Login button

**Expected Result:**
- Login fails
- Error message displays: "Your email or password is incorrect!"
- User remains on login page
- Login form is still accessible for retry
- Password field is cleared

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

#### TC6.4: Login with non-existent email fails
**Steps:**
1. Navigate to https://automationexercise.com/login
2. Attempt to login with:
   - Email: "nonexistent_[TIMESTAMP]@test.com"
   - Password: "anypassword"
   - Click Login button

**Expected Result:**
- Login fails
- Error message displays indicating invalid credentials
- User remains on login page
- No account information is revealed

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

## Security Tests

### ST1: No Sensitive Data Exposure
**Steps:**
1. Create account with Test Case TC2.1
2. After successful creation, check page source code (F12 > Sources tab)
3. Search for plaintext password in HTML or JavaScript

**Expected Result:**
- Password is NOT visible in page source code
- Password is NOT stored in HTML attributes
- Password is NOT logged in console
- Email is visible but properly protected

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

### ST2: XSS Prevention in Name Field
**Steps:**
1. Navigate to https://automationexercise.com/login
2. In signup form, enter:
   - Name: "<script>alert('XSS')</script>"
   - Email: "xss_[TIMESTAMP]@test.com"
   - Click Signup

**Expected Result:**
- No alert dialog appears (XSS is prevented)
- Script tags are treated as regular text or sanitized
- Account creation proceeds normally (if other data valid)
- Name is stored safely without executing any code

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

### ST3: SQL Injection Prevention
**Steps:**
1. Navigate to https://automationexercise.com/login
2. Attempt to enter SQL injection in various fields:
   - Name: "test' OR '1'='1"
   - Email: "test' OR '1'='1@test.com" (will fail email validation)

**Expected Result:**
- Email validation prevents submission
- Name field accepts it as text (if form submits for other validation)
- No database errors occur
- No unauthorized data access

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

## Edge Cases and Error Handling

### EC1: Form State After Error
**Steps:**
1. Navigate to https://automationexercise.com/login
2. Enter duplicate email (TC4.1)
3. Observe form state after error
4. Clear email field and enter new valid email

**Expected Result:**
- Form remains on signup page
- Name field retains its value
- Error message is clear and actionable
- User can correct and resubmit form
- No data loss

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

### EC2: Page Refresh During Signup
**Steps:**
1. Navigate to https://automationexercise.com/login
2. Fill signup form with:
   - Name: "Test User"
   - Email: "test@test.com"
3. Press F5 or refresh page
4. Observe form state

**Expected Result:**
- Form is reset to empty state
- No partial data is retained
- Form is fully functional after refresh
- No error messages

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

### EC3: Browser Back Button After Signup
**Steps:**
1. Create account (TC2.1)
2. On success page, click browser back button
3. Observe navigation

**Expected Result:**
- May go back to login page (logged in state)
- May show cached page
- Clicking forward returns to account page
- No double registration occurs

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

### EC4: Multiple Signup Attempts with Same Email
**Steps:**
1. Create account with email "test_[TIMESTAMP]@test.com"
2. Complete signup successfully
3. Logout
4. Attempt signup with same email again
5. Attempt signup with different data but same email

**Expected Result:**
- Second signup attempt fails with "Email Address already exist!" error
- No duplicate accounts are created
- User must use different email or login with original credentials

**Actual Result:** ___________________  
**Status:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

## Test Summary

| Acceptance Criteria | Test Cases | Passed | Failed |
|---|---|---|---|
| AC1: Signup Form Display | TC1.1, TC1.2, TC1.3 | ___ | ___ |
| AC2: Valid Data Acceptance | TC2.1, TC2.2, TC2.3, TC2.4 | ___ | ___ |
| AC3: Invalid Email Prevention | TC3.1, TC3.2, TC3.3, TC3.4, TC3.5 | ___ | ___ |
| AC4: Duplicate Email Error | TC4.1, TC4.2 | ___ | ___ |
| AC5: Success Redirect | TC5.1, TC5.2, TC5.3 | ___ | ___ |
| AC6: Login with New Credentials | TC6.1, TC6.2, TC6.3, TC6.4 | ___ | ___ |
| Security Tests | ST1, ST2, ST3 | ___ | ___ |
| Edge Cases | EC1, EC2, EC3, EC4 | ___ | ___ |

**Total Passed:** _____ / _____  
**Total Failed:** _____ / _____  
**Pass Rate:** _____%

---

## Sign-Off

**Tested By:** _____________________  
**Date:** _____________________  
**Environment:** Production / Staging / Development  
**Browser/OS:** _____________________  

**Overall Status:** ☐ PASS  ☐ FAIL  

**Comments/Issues Found:**
___________________________________________________________________
___________________________________________________________________
___________________________________________________________________

---

## Known Issues / Observations

1. ________________________________________________________________
2. ________________________________________________________________
3. ________________________________________________________________

---

**Approved By:** _____________________  
**Date:** _____________________
