import { Page, Locator } from '@playwright/test';
export declare class LoginPage {
    readonly page: Page;
    readonly loginButton: Locator;
    readonly googleOption: Locator;
    readonly phoneOption: Locator;
    readonly gmailOption: Locator;
    readonly facebookOption: Locator;
    readonly emailField: Locator;
    readonly passwordField: Locator;
    readonly submitButton: Locator;
    readonly avatar: Locator;
    readonly userName: Locator;
    constructor(page: Page);
    goto(url: string): Promise<void>;
    clickLogin(): Promise<void>;
    loginWithEmail(email: string, password: string): Promise<void>;
}
//# sourceMappingURL=LoginPage.d.ts.map