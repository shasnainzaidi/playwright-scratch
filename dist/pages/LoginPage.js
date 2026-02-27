"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const test_1 = require("@playwright/test");
class LoginPage {
    constructor(page) {
        this.page = page;
        this.loginButton = page.locator('text=Login');
        this.googleOption = page.locator('text=Login with Google');
        this.phoneOption = page.locator('text=Login with Phone');
        this.emailOption = page.locator('text=Login with Email');
        this.facebookOption = page.locator('text=Login with Facebook');
        this.emailOption = page.locator('text=Login with Email');
        this.emailField = page.locator('input[type="email"]');
        this.passwordField = page.locator('input[type="password"]');
        this.submitButton = page.getByRole('button', { name: 'Log In' });
        this.avatar = page.getByAltText('User profile picture');
        this.userName = page.getByLabel('Username');
    }
    async goto(url) {
        await this.page.goto(url);
    }
    async clickLogin() {
        await this.loginButton.click();
    }
    async loginWithEmail(email, password) {
        await this.emailOption.click();
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.submitButton.click();
    }
}
exports.LoginPage = LoginPage;
//# sourceMappingURL=LoginPage.js.map