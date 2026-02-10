import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const BASE_URL = 'https://www.olx.com.pk/'; // replace

test.describe('Login Options', () => {

    test('Verify Google login option is visible', async ({ page }) => {

        const login = new LoginPage(page);

        await login.goto(BASE_URL);
        await login.clickLogin();

        await expect(login.googleOption).toBeVisible();
    });

    test('Verify Phone login option is visible', async ({ page }) => {

        const login = new LoginPage(page);

        await login.goto(BASE_URL);
        await login.clickLogin();

        await expect(login.phoneOption).toBeVisible();
    });

    test('Verify Email login option is visible', async ({ page }) => {

        const login = new LoginPage(page);

        await login.goto(BASE_URL);
        await login.clickLogin();

        await expect(login.emailOption).toBeVisible();
    });

    test('Verify Facebook login option is visible', async ({ page }) => {

        const login = new LoginPage(page);

        await login.goto(BASE_URL);
        await login.clickLogin();

        await expect(login.facebookOption).toBeVisible();
    });

});
