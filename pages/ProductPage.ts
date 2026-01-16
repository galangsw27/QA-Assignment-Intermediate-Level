import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductPage - Represents a product detail page
 * Handles viewing product details and adding to cart
 */
export class ProductPage extends BasePage {
    // Selectors
    private readonly productName = '.name';
    private readonly productPrice = '.price-container';
    private readonly productDescription = '#more-information';
    private readonly addToCartButton = 'a.btn-success:has-text("Add to cart")';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Get the product name/title
     * @returns Product name
     */
    async getProductName(): Promise<string> {
        await this.waitForElement(this.productName);
        const text = await this.page.textContent(this.productName);
        return text?.trim() || '';
    }

    /**
     * Get the product price
     * @returns Product price as string (e.g., "$790")
     */
    async getProductPrice(): Promise<string> {
        const text = await this.page.textContent(this.productPrice);
        // Extract price from text like "$790 *includes tax"
        const match = text?.match(/\$\d+/);
        return match ? match[0] : '';
    }

    /**
     * Get the product description
     * @returns Product description text
     */
    async getProductDescription(): Promise<string> {
        const text = await this.page.textContent(this.productDescription);
        return text?.trim() || '';
    }

    /**
     * Add product to cart and handle the alert
     * @returns The alert message (e.g., "Product added")
     */
    async addToCart(): Promise<string> {
        // Setup alert handler before clicking
        const alertPromise = this.handleAlert(true);

        // Click add to cart button
        await this.page.click(this.addToCartButton);

        // Wait for and handle the alert
        const alertMessage = await alertPromise;

        return alertMessage;
    }

    /**
     * Check if currently on a product page
     * @returns true if on product page
     */
    async isOnProductPage(): Promise<boolean> {
        try {
            await this.page.waitForSelector(this.productName, { state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
}
