import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('Stage specific test', async ({ page }, testInfo) => {
  
  test.skip(testInfo.project.name !== 'stage', 
    'Runs only on stage');

  const aeUrl = process.env.AE_URL || 'https://automationexercise.com';
  await page.goto(aeUrl);
  await expect(page).toHaveTitle(/Automation/);
});