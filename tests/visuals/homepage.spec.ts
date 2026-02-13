import { test, expect } from '@playwright/test';

test('@visual Homepage visual check', async ({ page }) => {

    await page.goto('/');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage.png');
});
