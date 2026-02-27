"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const SearchPage_1 = require("../../pages/SearchPage");
(0, test_1.test)('@visual Search results page UI', async ({ page }) => {
    const search = new SearchPage_1.SearchPage(page);
    await page.goto('/');
    await search.search('laptop');
    await (0, test_1.expect)(search.resultsContainer).toHaveScreenshot('search-results.png', {
        maxDiffPixels: 150,
        animations: 'disabled'
    });
});
//# sourceMappingURL=searchpage.spec.js.map