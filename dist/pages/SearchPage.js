"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchPage = void 0;
const test_1 = require("@playwright/test");
class SearchPage {
    constructor(page) {
        this.page = page;
        this.searchInput = page.getByPlaceholder('Find Cars, Mobile Phones and more...');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resultsContainer = page.locator('#results');
    }
    async search(text) {
        await this.searchInput.fill(text);
        await this.searchButton.click();
        await this.resultsContainer.waitFor();
    }
}
exports.SearchPage = SearchPage;
//# sourceMappingURL=SearchPage.js.map