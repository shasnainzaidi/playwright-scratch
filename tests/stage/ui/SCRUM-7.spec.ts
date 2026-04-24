import { test, expect } from '@playwright/test';
import { AeHomePage } from '../../../pages/stage/aeHomePage';
import { AeProductsPage } from '../../../pages/stage/aeProductsPage';

test.describe.configure({ mode: 'serial' });

test.describe('SCRUM-7 - Product Search', () => {

  test('SCRUM-7-TC-01 - AC1 - Search box accepts text input', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'stage', 'Runs only on stage');

    const homePage = new AeHomePage(page);
    const productsPage = new AeProductsPage(page);

    await homePage.goto();
    await homePage.clickProducts();
    await productsPage.waitForSearchInputVisible();

    // Click on search box
    await productsPage.searchInput.click();

    // Type text into search box
    await productsPage.fillSearchInput('Dress');

    // Verify text is entered and displayed in search box
    await productsPage.expectSearchInputHasValue('Dress');
  });

  test('SCRUM-7-TC-02 - AC2 - Search returns relevant results for valid query', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'stage', 'Runs only on stage');

    const homePage = new AeHomePage(page);
    const productsPage = new AeProductsPage(page);

    await homePage.goto();
    await homePage.clickProducts();
    await page.waitForTimeout(2000);

    await productsPage.waitForSearchInputVisible();
    await productsPage.fillSearchInput('Dress');
    await productsPage.submitSearch();

    // Verify search results exist
    await productsPage.expectSearchResultsFound();
  });

  test('SCRUM-7-TC-04 - AC4 - Search results are clickable and navigate to product detail pages', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'stage', 'Runs only on stage');

    const homePage = new AeHomePage(page);
    const productsPage = new AeProductsPage(page);

    await homePage.goto();
    await homePage.clickProducts();
    await page.waitForTimeout(2000);

    await productsPage.waitForSearchInputVisible();
    await productsPage.fillSearchInput('Dress');
    await productsPage.submitSearch();

    // Click on first product
    await productsPage.clickFirstProductResult();

    // Verify product detail page loaded
    await productsPage.expectProductDetailPageLoaded();
  });

  test('SCRUM-7-TC-05 - Negative - Empty search behavior', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'stage', 'Runs only on stage');

    const homePage = new AeHomePage(page);
    const productsPage = new AeProductsPage(page);

    await homePage.goto();
    await homePage.clickProducts();
    await page.waitForTimeout(2000);

    await productsPage.waitForSearchInputVisible();

    // Click on search box and verify it's empty
    await productsPage.searchInput.click();
    await productsPage.expectSearchInputIsEmpty();

    // Submit search with empty input
    await productsPage.submitSearch();

    // Verify system displays expected behavior
    await productsPage.expectPageHasContent();
  });

  test('SCRUM-7-TC-06 - Case sensitivity - Search with different cases returns same results', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'stage', 'Runs only on stage');

    const homePage = new AeHomePage(page);
    const productsPage = new AeProductsPage(page);

    await homePage.goto();
    await homePage.clickProducts();
    await page.waitForTimeout(2000);

    await productsPage.waitForSearchInputVisible();

    // Search for 'dress' (lowercase)
    await productsPage.fillSearchInput('dress');
    await productsPage.submitSearch();

    // Count results
    const lowercaseResultsCount = await productsPage.getProductCount();
    expect(lowercaseResultsCount).toBeGreaterThanOrEqual(0);

    // Go back to products page for next search
    await productsPage.clearSearchAndNavigateToProducts();
    await productsPage.waitForSearchInputVisible();

    // Search for 'DRESS' (uppercase)
    await productsPage.fillSearchInput('DRESS');
    await productsPage.submitSearch();

    // Verify results count is the same (case-insensitive)
    const uppercaseResultsCount = await productsPage.getProductCount();
    expect(uppercaseResultsCount).toBe(lowercaseResultsCount);
  });

});
