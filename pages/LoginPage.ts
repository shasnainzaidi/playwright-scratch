import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly loginButton: Locator;
    readonly googleOption: Locator;
    readonly phoneOption: Locator;
    readonly facebookOption: Locator;
    readonly emailOption: Locator;
    readonly emailField: Locator;
    readonly phoneField: Locator;
    readonly passwordField: Locator;
    readonly submitButton: Locator;
    readonly avatar: Locator;
    readonly userName: Locator;


    constructor(page: Page) {
        this.page = page;

        this.loginButton = page.locator('text=Login');
        this.googleOption = page.locator('text=Login with Google');
        this.phoneOption = page.locator('text=Login with Phone');
        this.emailOption = page.locator('text=Login with Email');
        this.facebookOption = page.locator('text=Login with Facebook');
        this.emailField = page.locator('input[type="email"]');
        this.phoneField = page.locator('input[type="tel"]');
        this.passwordField = page.locator('input[type="password"]');
        this.submitButton = page.getByRole('button', { name: 'Log In' });
        this.avatar = page.getByAltText('User profile picture');
        this.userName = page.getByLabel('Username');
    }

    async goto(url: string) {
        await this.page.goto(url);
    }

    async clickLogin() {
        await this.loginButton.click();
    }
 async loginWithEmail(email: string, password: string) {

        await this.emailOption.click();

        await this.emailField.fill(email);
        await this.passwordField.fill(password);

        await this.submitButton.click();
    }

    async loginWithPhone(phone: string, password: string) {
        await this.phoneOption.click();

        await this.phoneField.fill(phone);
        await this.passwordField.fill(password);

        await this.submitButton.click();
    }
}
