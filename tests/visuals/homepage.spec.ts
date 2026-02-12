import { test, expect } from '@playwright/test';

test('Homepage visual check', async ({ page }) => {

    await page.goto('/');

    // Wait for fonts & layout stability
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage.png');
});
