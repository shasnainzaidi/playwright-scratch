import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({

  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 3,

  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['allure-playwright']
  ],

  use: {
    baseURL: process.env.BASE_URL, // ✅ Single source of truth
    browserName: 'chromium',       // ✅ Only Chromium
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    animations: 'disabled'
  },

  projects: [

    // ✅ AUTH SETUP (RUNS FIRST)
    {
      name: 'auth-setup',
      testMatch: /.*\.setup\.ts/
    },

    // ✅ MAIN TEST RUNNER (SMOKE + REGRESSION)
    {
      name: 'chromium',
      dependencies: ['auth-setup'],

      grep: /@smoke|@regression/, // ✅ Only run tagged tests

      use: {
        storageState: 'playwright/.auth/emailAuth.json'
      }
    },

    // ✅ AUTOMATION EXERCISE (AE) PROJECTS
    {
      name: 'ae-forms',
      testDir: './tests/stage/forms',
      use: {
        baseURL: process.env.AE_URL || 'https://automationexercise.com',
        browserName: 'chromium',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
      },
    },

    {
      name: 'ae-auth',
      testDir: './tests/stage/auth',
      use: {
        baseURL: process.env.AE_URL || 'https://automationexercise.com',
        browserName: 'chromium',
      },
    },

  ]

});