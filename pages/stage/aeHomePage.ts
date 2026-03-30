import { Page, Locator, expect } from '@playwright/test';

export class AeHomePage {
  readonly page: Page;

  // ── Locators ───────────────────────────────────────
  readonly logo: Locator;
  readonly navHome: Locator;
  readonly navProducts: Locator;
  readonly navCart: Locator;
  readonly navLogin: Locator;
  readonly navLogout: Locator;
  readonly navContactUs: Locator;
  readonly slider: Locator;
  readonly featuredItems: Locator;
  readonly subscribeEmailInput: Locator;
  readonly subscribeButton: Locator;
  readonly subscribeSuccess: Locator;
  readonly scrollUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo                = page.locator('#header a.navbar-brand');
    this.navHome             = page.locator('a[href="/"]').first();
    this.navProducts         = page.locator('a[href="/products"]');
    this.navCart             = page.locator('a[href="/view_cart"]');
    this.navLogin            = page.locator('a[href="/login"]');
    this.navLogout           = page.locator('a[href="/logout"]');
    this.navContactUs        = page.locator('a[href="/contact_us"]');
    this.slider              = page.locator('#slider');
    this.featuredItems       = page.locator('.features_items .col-sm-4');
    this.subscribeEmailInput = page.locator('#susbscribe_email');
    this.subscribeButton     = page.locator('#subscribe');
    this.subscribeSuccess    = page.locator('#success-subscribe');
    this.scrollUpButton      = page.locator('#scrollUp');
  }

  // ── Actions ────────────────────────────────────────
  async goto() {
    const aeUrl = process.env.AE_URL || 'https://automationexercise.com';
    await this.page.goto(aeUrl);
  }

  async clickProducts() {
    await this.navProducts.click();
  }

  async clickCart() {
    await this.navCart.click();
  }

  async subscribeWithEmail(email: string) {
    await this.subscribeEmailInput.fill(email);
    await this.subscribeButton.click();
  }

  async scrollToFooter() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollBackToTop() {
    await this.scrollUpButton.click();
  }

  // ── Assertions ─────────────────────────────────────
  async expectPageLoaded() {
    await expect(this.page).toHaveTitle(/Automation Exercise/);
    await expect(this.logo).toBeVisible();
  }

  async expectSliderVisible() {
    await expect(this.slider).toBeVisible();
  }

  async expectFeaturedItemsVisible() {
    await expect(this.featuredItems.first()).toBeVisible();
  }

  async expectSubscribeSuccess() {
    await expect(this.subscribeSuccess).toBeVisible();
  }

  async expectNavLinksVisible() {
    await expect(this.navHome).toBeVisible();
    await expect(this.navProducts).toBeVisible();
    await expect(this.navCart).toBeVisible();
  }
}