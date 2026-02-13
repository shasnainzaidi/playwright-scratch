import { Page, Locator } from '@playwright/test';

export class SearchPage {

    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly resultsContainer: Locator;

    constructor(page: Page){
        this.page = page;
        this.searchInput = page.getByPlaceholder('Find Cars, Mobile Phones and more...');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resultsContainer = page.locator('#results');
    }

    async search(text: string){
        await this.searchInput.fill(text);
        await this.searchButton.click();
        await this.resultsContainer.waitFor();
    }
}
