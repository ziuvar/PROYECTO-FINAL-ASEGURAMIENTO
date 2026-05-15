import { expect, type Locator, type Page } from '@playwright/test';
import { normalizeText } from '../utils/evidence';

export class CnariosPage {
  constructor(private readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle', { timeout: 12_000 }).catch(() => undefined);
  }

  async openTryItYourself(): Promise<void> {
    await this.page.getByRole('tab', { name: /try it yourself/i }).click();
  }

  async expectHeading(text: RegExp | string): Promise<void> {
    await expect(this.page.locator('h1,h2,h3').filter({ hasText: text }).first()).toBeVisible();
  }

  async getConsoleErrorsWhile(action: () => Promise<void>): Promise<string[]> {
    const errors: string[] = [];
    this.page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    await action();
    return errors;
  }

  productNamesForPagination(): Locator {
    return this.page.locator('h6.font-semibold').filter({
      hasNotText: /Objectives|Requirements|Acceptance Criteria|Filters|Concepts|Challenges|Blogs|Hints/i
    });
  }

  productNamesForFiltering(): Locator {
    return this.page.locator('p.font-medium');
  }

  async getPaginationProductNames(): Promise<string[]> {
    return (await this.productNamesForPagination().allTextContents()).map(normalizeText).filter(Boolean);
  }

  async getFilteringProductNames(): Promise<string[]> {
    return (await this.productNamesForFiltering().allTextContents()).map(normalizeText).filter(Boolean);
  }

  async getFilteringProductDetails(): Promise<string[]> {
    return (await this.page.locator('p.css-vouxdn').allTextContents())
      .map(normalizeText)
      .filter((line) => /•/.test(line));
  }
}
