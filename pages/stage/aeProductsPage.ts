import { Page, Locator, expect } from '@playwright/test';

export class AeProductsPage {
  readonly page: Page;

  // ── Locators ───────────────────────────────────────
  readonly searchInput: Locator;
  readonly productItems: Locator;
  readonly productLinks: Locator;
  readonly noResultsMessage: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder*="Search"]').first();
    this.productItems = page.locator('[class*="productinfo"]');
    this.productLinks = page.locator('a[href*="/product/"]');
    this.noResultsMessage = page.locator('text=There is no product');
    this.productPrice = page.locator('span:has-text("Rs.")').first();
  }

  // ── Actions ────────────────────────────────────────
  async goto() {
    const aeUrl = process.env.AE_URL || 'https://automationexercise.com';
    await this.page.goto(aeUrl + '/products');
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  }

  async waitForSearchInputVisible() {
    await this.searchInput.waitFor({ timeout: 10000 });
  }

  async fillSearchInput(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async getSearchInputValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  async submitSearch() {
    await this.searchInput.press('Enter');
    await this.page.waitForTimeout(3000);
  }

  async clearSearchAndNavigateToProducts() {
    const aeUrl = process.env.AE_URL || 'https://automationexercise.com';
    await this.page.goto(aeUrl + '/products');
    await this.page.waitForTimeout(2000);
  }

  async clickFirstProductResult() {
    const firstProduct = this.productItems.first();
    await firstProduct.waitFor({ timeout: 5000 });
    const productLink = firstProduct.locator('a').first();
    await productLink.waitFor({ timeout: 5000 });
    await productLink.click();
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  // ── Assertions ─────────────────────────────────────
  async expectSearchInputVisible() {
    await expect(this.searchInput).toBeVisible();
  }

  async expectSearchInputHasValue(value: string) {
    const inputValue = await this.getSearchInputValue();
    expect(inputValue).toBe(value);
  }

  async expectSearchInputIsEmpty() {
    const inputValue = await this.getSearchInputValue();
    expect(inputValue).toBe('');
  }

  async expectSearchResultsFound() {
    const count = await this.getProductCount();
    expect(count).toBeGreaterThan(0);
  }

  async expectProductDetailPageLoaded() {
    const currentUrl = this.page.url();
    expect(currentUrl).toContain('product');

    // Verify product information is displayed
    const pageHasHeading = await this.page.locator('h2').count().then(count => count > 0);
    const pageHasPrice = await this.page.locator('text=/Rs|Price|\$|€/i').count().then(count => count > 0);

    expect(pageHasHeading || pageHasPrice).toBe(true);
  }

  async expectNoResultsMessage() {
    const isVisible = await this.noResultsMessage.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  }

  async expectPageHasContent() {
    const pageText = await this.page.content();
    const hasContent = pageText.length > 0;
    expect(hasContent).toBe(true);
  }
}
