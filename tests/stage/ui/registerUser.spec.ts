import { test, expect } from '@playwright/test';
import { AeHomePage } from '../../../pages/stage/aeHomePage';

test.describe.configure({ mode: 'serial' });

test('Stage specific test', async ({ page }, testInfo) => {
  
  test.skip(testInfo.project.name !== 'stage', 
    'Runs only on stage');

  const homePage = new AeHomePage(page);
  await homePage.goto();
  await expect(page).toHaveTitle(/Automation/);
});