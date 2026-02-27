"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const LoginPage_1 = require("../pages/LoginPage");
const loginData_1 = require("../test-data/loginData");
(0, test_1.test)('User can login with Email', async ({ page }) => {
    const login = new LoginPage_1.LoginPage(page);
    await login.goto('/');
    await login.clickLogin();
    await login.loginWithEmail(loginData_1.loginData.validUser.email, loginData_1.loginData.validUser.password);
    await (0, test_1.expect)(login.avatar).toBeVisible();
    await (0, test_1.expect)(login.userName).toHaveText('Everything for “U”');
    await page.context().storageState({
        path: 'playwright/.auth/emailAuth.json'
    });
});
//# sourceMappingURL=EmailLogin.spec.js.map