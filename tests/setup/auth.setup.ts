import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { loginData } from '../../test-data/loginData';

setup('authenticate', async ({ page }) => {

    const login = new LoginPage(page);

    await page.goto('/');
    await login.clickLogin();

    await login.loginWithEmail(
        loginData.validUser.email,
        loginData.validUser.password
    );

    await page.waitForLoadState('networkidle');

    await page.context().storageState({
        path: 'playwright/.auth/user.json'
    });
});
