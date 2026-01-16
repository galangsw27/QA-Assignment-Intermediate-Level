import { Page } from '@playwright/test';

/**
 * BasePage class - Parent class for all page objects
 * Contains common methods and utilities shared across pages
 */
export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Wait for page to be fully loaded
     * Using domcontentloaded instead of networkidle because demoblaze.com
     * has persistent network activity that causes networkidle to timeout
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Handle browser alert/dialog
     * @param accept - Whether to accept or dismiss the alert
     * @returns The alert message
     */
    async handleAlert(accept: boolean = true): Promise<string> {
        return new Promise((resolve) => {
            this.page.once('dialog', async (dialog) => {
                const message = dialog.message();
                if (accept) {
                    await dialog.accept();
                } else {
                    await dialog.dismiss();
                }
                resolve(message);
            });
        });
    }

    /**
     * Wait for element to be visible
     * @param selector - CSS selector
     */
    async waitForElement(selector: string): Promise<void> {
        await this.page.waitForSelector(selector, { state: 'visible' });
    }

    /**
     * Click element with retry
     * @param selector - CSS selector
     */
    async clickWithRetry(selector: string, retries: number = 3): Promise<void> {
        for (let i = 0; i < retries; i++) {
            try {
                await this.page.click(selector);
                return;
            } catch (error) {
                if (i === retries - 1) throw error;
                await this.page.waitForTimeout(1000);
            }
        }
    }
}
