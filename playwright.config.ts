import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({

  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,

  reporter: [
    ['html'],
    ['allure-playwright']
  ],

  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'email-auth',
      testMatch: /emailAuth\.setup\.ts/,
    },
    {
      name: 'phone-auth',
      testMatch: /apiAuth\.setup\.ts/,
    },
    {
      name: 'chromium-email',
      use: { storageState: 'playwright/.auth/emailUI.json' },
      dependencies: ['email-auth'],
    },
    {
      name: 'chromium-phone',
      use: { storageState: 'playwright/.auth/phoneAPI.json' },
      dependencies: ['phone-auth'],
    },
  ],
});
