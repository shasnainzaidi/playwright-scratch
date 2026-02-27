"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)('@visual Homepage visual check', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await (0, test_1.expect)(page).toHaveScreenshot('homepage.png');
});
//# sourceMappingURL=homepage.spec.js.map