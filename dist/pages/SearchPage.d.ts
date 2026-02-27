import { Page, Locator } from '@playwright/test';
export declare class SearchPage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly resultsContainer: Locator;
    constructor(page: Page);
    search(text: string): Promise<void>;
}
//# sourceMappingURL=SearchPage.d.ts.map