import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../test-data/loginData';

test('User can login with Email', async ({ page }) => {

    const login = new LoginPage(page);

    await login.goto('/');
    await login.clickLogin();

    await login.loginWithEmail(
       loginData.validUser.email,
       loginData.validUser.password
    );

    await expect(login.avatar).toBeVisible();

    await expect(login.userName).toHaveText('Everything for “U”');
    await page.context().storageState({
            path: 'playwright/.auth/emailAuth.json'
            });
});