import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../test-data/loginData';


test.describe('@smoke Login Options', () => {

    test('@smoke Verify Google login option is visible', async ({ page }) => {

        const login = new LoginPage(page);

        await login.goto('/');
        await login.clickLogin();

        await expect(login.googleOption).toBeVisible();
    });

    test('@smoke Verify Phone login option is visible', async ({ page }) => {

        const login = new LoginPage(page);

        await login.goto('/');
        await login.clickLogin();

        await expect(login.phoneOption).toBeVisible();
    });

    test('@smoke Verify Email login option is visible', async ({ page }) => {

        const login = new LoginPage(page);

        await login.goto('/');
        await login.clickLogin();

        await expect(login.emailOption).toBeVisible();
    });

    test('@smoke Verify Facebook login option is visible', async ({ page }) => {

        const login = new LoginPage(page);

        await login.goto('/');
        await login.clickLogin();

        await expect(login.facebookOption).toBeVisible();
    });


});
