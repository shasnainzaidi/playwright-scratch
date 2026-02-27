"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = (0, test_1.defineConfig)({
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
        {
            name: 'chromium-public',
            testIgnore: [
                /emailAuth\.setup\.ts/,
                /apiAuth\.setup\.ts/,
                /EmailLogin\.spec\.ts/
            ],
            use: {
                browserName: 'chromium'
            }
        },
        {
            name: 'email-auth',
            testMatch: /emailAuth\.setup\.ts/
        },
        {
            name: 'phone-auth',
            testMatch: /apiAuth\.setup\.ts/
        },
        {
            name: 'chromium-email',
            testMatch: /EmailLogin\.spec\.ts/,
            use: {
                browserName: 'chromium',
                storageState: 'playwright/.auth/emailAuth.json'
            },
            dependencies: ['email-auth']
        },
        {
            name: 'chromium-phone',
            testIgnore: [
                /emailAuth\.setup\.ts/,
                /apiAuth\.setup\.ts/,
                /EmailLogin\.spec\.ts/
            ],
            use: {
                browserName: 'chromium',
                storageState: 'playwright/.auth/phoneAuth.json'
            },
            dependencies: ['phone-auth']
        }
    ]
});
//# sourceMappingURL=playwright.config.js.map