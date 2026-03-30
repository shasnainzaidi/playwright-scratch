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
    animations: 'disabled'

  },

projects: [

  // ==========================
  // STAGE - CHROMIUM
  // ==========================
  {
    name: 'stage-chromium',
    use: {
      browserName: 'chromium',
      baseURL: 'https://automationexercise.com/',
    },
  },

  // ==========================
  // PROD - CHROMIUM
  // ==========================
  {
    name: 'prod-chromium',
    use: {
      browserName: 'chromium',
      baseURL: 'https://www.olx.com.pk/',
    },
  },

  // ==========================
  // AUTH PROJECTS (UNCHANGED)
  // ==========================
  {
    name: 'email-auth',
    testMatch: /emailAuth\.setup\.ts/
  },

  {
    name: 'phone-auth',
    testMatch: /apiAuth\.setup\.ts/
  },

  {
    name: 'prod-email',
    testMatch: /EmailLogin\.spec\.ts/,
    use: {
      browserName: 'chromium',
      baseURL: 'https://www.olx.com.pk/',
      storageState: 'playwright/.auth/emailAuth.json'
    },
    dependencies: ['email-auth']
  },

  {
    name: 'prod-phone',
    testIgnore: [
      /emailAuth\.setup\.ts/,
      /apiAuth\.setup\.ts/,
      /EmailLogin\.spec\.ts/
    ],
    use: {
      browserName: 'chromium',
      baseURL: 'https://www.olx.com.pk/',
      storageState: 'playwright/.auth/phoneAuth.json'
    },
    dependencies: ['phone-auth']
  },
    {
      name: 'ae-auth-setup',
      testDir: './tests/stage/setup',
      testMatch: /auth\.setup\.ts/,
      use: { baseURL: process.env.AE_URL },
    },
    {
      name: 'ae-auth',
      testDir: './tests/stage/auth',
      dependencies: ['ae-auth-setup'],
      use: {
        baseURL: process.env.AE_URL,
        browserName: 'chromium',
        storageState: 'playwright/.auth/aeAuth.json',
      },
    },
    {
      name: 'ae-forms',
      testDir: './tests/stage/forms',
      dependencies: ['ae-auth-setup'],
      use: {
        baseURL: process.env.AE_URL,
        browserName: 'chromium',
        storageState: 'playwright/.auth/aeAuth.json',
      },
    },
    {
      name: 'ae-api',
      testDir: './tests/stage/api',
      use: {
        baseURL: process.env.AE_URL,
        browserName: 'chromium',
      },
    },
    {
      name: 'ae-ui',
      testDir: './tests/stage/ui',
      use: {
        baseURL: process.env.AE_URL,
        browserName: 'chromium',
      },

  }

]
});
