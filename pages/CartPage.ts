import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage - Represents the shopping cart page
 * Handles viewing cart items, verification, and placing orders
 */
export class CartPage extends BasePage {
    // Selectors
    private readonly cartTable = '#tbodyid';
    private readonly cartItem = '#tbodyid tr';
    private readonly totalPrice = '#totalp';
    private readonly placeOrderButton = 'button:has-text("Place Order")';
    private readonly deleteButton = 'a:has-text("Delete")';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate directly to cart page
     */
    async navigate(): Promise<void> {
        await this.page.goto('/cart.html');
        await this.waitForPageLoad();
    }

    /**
     * Wait for cart to load
     */
    async waitForCartLoad(): Promise<void> {
        await this.page.waitForSelector(this.cartTable, { state: 'visible' });
        await this.page.waitForTimeout(1000); // Wait for items to load
    }

    /**
     * Get all cart items
     * @returns Array of cart item details
     */
    async getCartItems(): Promise<Array<{ title: string; price: string }>> {
        await this.waitForCartLoad();

        const items = await this.page.$$eval(this.cartItem, (rows) => {
            return rows.map((row) => {
                const cells = row.querySelectorAll('td');
                return {
                    title: cells[1]?.textContent?.trim() || '',
                    price: cells[2]?.textContent?.trim() || '',
                };
            });
        });

        return items;
    }

    /**
     * Verify if a specific item is in the cart
     * @param productName - Name of the product to verify
     * @returns true if item is in cart
     */
    async verifyItemInCart(productName: string): Promise<boolean> {
        const items = await this.getCartItems();
        return items.some((item) => item.title.includes(productName));
    }

    /**
     * Get the total price displayed in cart
     * @returns Total price as number
     */
    async getTotalPrice(): Promise<number> {
        try {
            await this.page.waitForSelector(this.totalPrice, { state: 'visible', timeout: 5000 });
            const text = await this.page.textContent(this.totalPrice);
            return parseInt(text || '0', 10);
        } catch {
            return 0;
        }
    }

    /**
     * Click Place Order button to open order modal
     */
    async placeOrder(): Promise<void> {
        await this.page.click(this.placeOrderButton);
        await this.page.waitForSelector('#orderModal', { state: 'visible' });
    }

    /**
     * Delete an item from cart by product name
     * @param productName - Name of product to delete
     */
    async deleteItem(productName: string): Promise<void> {
        const row = this.page.locator(`${this.cartItem}:has-text("${productName}")`);
        await row.locator(this.deleteButton).click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Check if cart is empty
     * @returns true if cart has no items
     */
    async isCartEmpty(): Promise<boolean> {
        const items = await this.getCartItems();
        return items.length === 0 || (items.length === 1 && items[0].title === '');
    }
}
