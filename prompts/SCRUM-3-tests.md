# SCRUM-3 — Manual Test Cases

Story: Login with phone number option visible on login page (SCRUM-3)

Scope: Verify presence and functionality of the "Login with Phone" option for Normal and Agent users.

Test cases

1) Positive Scenarios
- TC-01: Phone option is visible (Normal User):
  - Precondition: User on home page.
  - Steps: Click `Login` → observe login options.
  - Expected: `Login with Phone` option is visible and enabled.

- TC-02: Phone login succeeds with valid credentials (Normal User):
  - Precondition: Valid phone & password available.
  - Steps: Click `Login` → choose `Login with Phone` → enter valid phone and password → click `Log In`.
  - Expected: User is authenticated; avatar visible; username matches expected; landing page accessible.

- TC-03: Phone option is visible (Agent User):
  - Precondition: Agent user account or agent test flow.
  - Steps: Click `Login` → observe login options.
  - Expected: `Login with Phone` option is visible for Agent as well.

2) Negative Scenarios
- TC-04: Phone login with invalid phone number
  - Steps: Click `Login` → choose `Login with Phone` → enter invalid phone → enter valid password → click `Log In`.
  - Expected: Login fails; appropriate error message shown (invalid phone or credentials); user remains unauthenticated.

- TC-05: Phone login with invalid password
  - Steps: Click `Login` → choose `Login with Phone` → enter valid phone → enter wrong password → click `Log In`.
  - Expected: Login fails; error stating incorrect credentials; no avatar displayed.

- TC-06: Missing phone input
  - Steps: Click `Login` → choose `Login with Phone` → leave phone empty → enter password → click `Log In`.
  - Expected: Client-side validation prevents submission or shows required-field message.

- TC-07: Missing password
  - Steps: Click `Login` → choose `Login with Phone` → enter phone → leave password empty → click `Log In`.
  - Expected: Client-side validation prevents submission or shows required-field message.

3) Edge Cases
- TC-08: Phone number with extra spaces or formatting
  - Steps: Enter phone with spaces, dashes, or parentheses → submit.
  - Expected: Input is normalized or rejected with guidance; login succeeds if normalized and credentials valid.

- TC-09: Extremely long phone number
  - Steps: Enter 100+ digit phone number → submit.
  - Expected: Input is rejected; validation message shown.

- TC-10: Rapid repeated submissions (double-click)
  - Steps: Click `Log In` multiple times quickly.
  - Expected: Only one authentication request sent; UI prevents duplicate requests (button disabled or spinner).

4) Validation / UI checks
- VC-01: `Login with Phone` option is accessible (keyboard navigation & screen reader)
  - Steps: Tab through modal; use ARIA or label checks.
  - Expected: Option reachable via keyboard; accessible name present.

- VC-02: Input types and attributes
  - Steps: Inspect phone input element.
  - Expected: `type="tel"` or `inputmode="tel"`; `maxlength` present if applicable; `autocomplete` attributes set appropriately.

- VC-03: Error messages and copy
  - Steps: Trigger invalid credentials and missing-field errors.
  - Expected: Errors are clear, not exposing internal details, and localized as required.

- VC-04: Remembered session/state
  - Steps: Login successfully → refresh page → verify session persistence.
  - Expected: User stays logged in; avatar visible.

Notes:
- For Agent variation, ensure role-specific UI is exercised (if Agent login flow differs).
- If phone authentication is implemented via API (token exchange), include API validations in automation.
- Capture screenshots for UI regressions.
