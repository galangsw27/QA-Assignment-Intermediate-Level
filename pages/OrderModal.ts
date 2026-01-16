import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Order form data interface
 */
export interface OrderData {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
}

/**
 * OrderModal - Handles the place order modal functionality
 */
export class OrderModal extends BasePage {
    // Selectors
    private readonly modal = '#orderModal';
    private readonly nameInput = '#name';
    private readonly countryInput = '#country';
    private readonly cityInput = '#city';
    private readonly cardInput = '#card';
    private readonly monthInput = '#month';
    private readonly yearInput = '#year';
    private readonly purchaseButton = '#orderModal button.btn-primary';
    private readonly closeButton = '#orderModal button.btn-secondary';
    private readonly successModal = '.sweet-alert';
    private readonly successMessage = '.sweet-alert h2';
    private readonly successDetails = '.sweet-alert p.lead';
    private readonly successOkButton = '.sweet-alert button.confirm';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Wait for order modal to be visible
     */
    async waitForModal(): Promise<void> {
        await this.page.waitForSelector(this.modal, { state: 'visible' });
    }

    /**
     * Fill the order form with provided data
     * @param data - Order form data
     */
    async fillOrderForm(data: OrderData): Promise<void> {
        await this.waitForModal();
        await this.page.fill(this.nameInput, data.name);
        await this.page.fill(this.countryInput, data.country);
        await this.page.fill(this.cityInput, data.city);
        await this.page.fill(this.cardInput, data.card);
        await this.page.fill(this.monthInput, data.month);
        await this.page.fill(this.yearInput, data.year);
    }

    /**
     * Click the purchase button to submit order
     */
    async submitOrder(): Promise<void> {
        await this.page.click(this.purchaseButton);
        // Wait for success modal
        await this.page.waitForSelector(this.successModal, { state: 'visible' });
    }

    /**
     * Get the success message from confirmation modal
     * @returns Success message text (e.g., "Thank you for your purchase!")
     */
    async getSuccessMessage(): Promise<string> {
        await this.page.waitForSelector(this.successMessage, { state: 'visible' });
        const text = await this.page.textContent(this.successMessage);
        return text?.trim() || '';
    }

    /**
     * Get the order details from success modal
     * @returns Order details text
     */
    async getOrderDetails(): Promise<string> {
        const text = await this.page.textContent(this.successDetails);
        return text?.trim() || '';
    }

    /**
     * Close the success modal by clicking OK
     */
    async closeSuccessModal(): Promise<void> {
        await this.page.click(this.successOkButton);
        await this.page.waitForSelector(this.successModal, { state: 'hidden' });
    }

    /**
     * Close the order modal without purchasing
     */
    async closeModal(): Promise<void> {
        await this.page.click(this.closeButton);
        await this.page.waitForSelector(this.modal, { state: 'hidden' });
    }

    /**
     * Complete the full order process
     * @param data - Order form data
     * @returns Success message
     */
    async completeOrder(data: OrderData): Promise<string> {
        await this.fillOrderForm(data);
        await this.submitOrder();
        const message = await this.getSuccessMessage();
        await this.closeSuccessModal();
        return message;
    }
}
