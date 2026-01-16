import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginModal - Handles the login modal functionality
 */
export class LoginModal extends BasePage {
    // Selectors
    private readonly modal = '#logInModal';
    private readonly usernameInput = '#loginusername';
    private readonly passwordInput = '#loginpassword';
    private readonly loginButton = '#logInModal button.btn-primary';
    private readonly closeButton = '#logInModal button.btn-secondary';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Wait for login modal to be visible
     */
    async waitForModal(): Promise<void> {
        await this.page.waitForSelector(this.modal, { state: 'visible' });
    }

    /**
     * Fill in the username field
     * @param username - Username to enter
     */
    async enterUsername(username: string): Promise<void> {
        await this.page.fill(this.usernameInput, username);
    }

    /**
     * Fill in the password field
     * @param password - Password to enter
     */
    async enterPassword(password: string): Promise<void> {
        await this.page.fill(this.passwordInput, password);
    }

    /**
     * Click the login button
     */
    async clickLoginButton(): Promise<void> {
        await this.page.click(this.loginButton);
    }

    /**
     * Perform complete login action
     * @param username - Username
     * @param password - Password
     */
    async login(username: string, password: string): Promise<void> {
        await this.waitForModal();
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();

        // Wait for modal to close and login to complete
        await this.page.waitForSelector(this.modal, { state: 'hidden' });
        await this.page.waitForTimeout(1000); // Wait for welcome message to appear
    }

    /**
     * Close the login modal without logging in
     */
    async closeModal(): Promise<void> {
        await this.page.click(this.closeButton);
        await this.page.waitForSelector(this.modal, { state: 'hidden' });
    }
}
