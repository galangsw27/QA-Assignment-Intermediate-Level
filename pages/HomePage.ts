import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage - Represents the main landing page of demoblaze.com
 * Handles navigation, category selection, and product browsing
 */
export class HomePage extends BasePage {
    // Selectors
    private readonly loginLink = '#login2';
    private readonly cartLink = '#cartur';
    private readonly logoutLink = '#logout2';
    private readonly nameOfUser = '#nameofuser';
    private readonly categoriesContainer = '#contcont';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to homepage
     */
    async navigate(): Promise<void> {
        await this.page.goto('/');
        await this.waitForPageLoad();
    }

    /**
     * Click on Login link to open login modal
     */
    async clickLogin(): Promise<void> {
        await this.page.click(this.loginLink);
        await this.page.waitForSelector('#logInModal', { state: 'visible' });
    }

    /**
     * Select a product category
     * @param category - Category name: 'Phones', 'Laptops', or 'Monitors'
     */
    async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<void> {
        await this.page.click(`a:has-text("${category}")`);
        // Wait for products to load
        await this.page.waitForTimeout(1000);
        await this.waitForPageLoad();
    }

    /**
     * Select a product by name
     * @param productName - The name of the product to select
     */
    async selectProduct(productName: string): Promise<void> {
        await this.page.click(`.card-title a:has-text("${productName}")`);
        await this.waitForPageLoad();
    }

    /**
     * Navigate to cart page
     */
    async goToCart(): Promise<void> {
        await this.page.click(this.cartLink);
        await this.waitForPageLoad();
    }

    /**
     * Check if user is logged in
     * @returns true if user is logged in
     */
    async isLoggedIn(): Promise<boolean> {
        try {
            await this.page.waitForSelector(this.nameOfUser, { state: 'visible', timeout: 5000 });
            const text = await this.page.textContent(this.nameOfUser);
            return text !== null && text.includes('Welcome');
        } catch {
            return false;
        }
    }

    /**
     * Get the welcome message text
     * @returns Welcome message with username
     */
    async getWelcomeMessage(): Promise<string> {
        const text = await this.page.textContent(this.nameOfUser);
        return text || '';
    }

    /**
     * Logout from the application
     */
    async logout(): Promise<void> {
        await this.page.click(this.logoutLink);
        await this.page.waitForSelector(this.loginLink, { state: 'visible' });
    }
}
