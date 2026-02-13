import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

test('@visual Search results page UI', async ({ page }) => {

    const search = new SearchPage(page);

    await page.goto('/');

    await search.search('laptop');

    await expect(search.resultsContainer).toHaveScreenshot(
        'search-results.png',
        {
            maxDiffPixels: 150,
            animations: 'disabled'
        }
    );
});
