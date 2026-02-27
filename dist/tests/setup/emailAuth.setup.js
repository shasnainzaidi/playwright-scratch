"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const LoginPage_1 = require("../../pages/LoginPage");
const loginData_1 = require("../../test-data/loginData");
(0, test_1.test)('authenticate', async ({ page }) => {
    const login = new LoginPage_1.LoginPage(page);
    await page.goto('/');
    await login.clickLogin();
    await login.loginWithEmail(loginData_1.loginData.validUser.email, loginData_1.loginData.validUser.password);
    await page.getByAltText('Go to chat');
    await page.context().storageState({
        path: 'playwright/.auth/emailAuth.json'
    });
});
//# sourceMappingURL=emailAuth.setup.js.map