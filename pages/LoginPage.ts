import { Page, Locator } from '@playwright/test';

export class LoginPage {

readonly page: Page;
readonly loginButton: Locator;
readonly googleOption: Locator;
readonly phoneOption: Locator;
readonly gmailOption: Locator;
readonly facebookOption: Locator;

constructor(page: Page) {
        this.page = page;

        this.loginButton = page.locator('text=Login');
        this.googleOption = page.locator('text=Login with Google');
        this.phoneOption = page.locator('text=Login with Phone');
        this.emailOption = page.locator('text=Login with Email');
        this.facebookOption = page.locator('text=Login with Facebook');
    }

    async goto(url: string) {
        await this.page.goto(url);
    }

    async clickLogin() {
        await this.loginButton.click();
    }
}
