"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const LoginPage_1 = require("../pages/LoginPage");
const loginData_1 = require("../test-data/loginData");
test_1.test.describe('@smoke Login Options', () => {
    (0, test_1.test)('@smoke Verify Google login option is visible', async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('/');
        await login.clickLogin();
        await (0, test_1.expect)(login.googleOption).toBeVisible();
    });
    (0, test_1.test)('@smoke Verify Phone login option is visible', async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('/');
        await login.clickLogin();
        await (0, test_1.expect)(login.phoneOption).toBeVisible();
    });
    (0, test_1.test)('@smoke Verify Email login option is visible', async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('/');
        await login.clickLogin();
        await (0, test_1.expect)(login.emailOption).toBeVisible();
    });
    (0, test_1.test)('@smoke Verify Facebook login option is visible', async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('/');
        await login.clickLogin();
        await (0, test_1.expect)(login.facebookOption).toBeVisible();
    });
});
//# sourceMappingURL=login.spec.js.map