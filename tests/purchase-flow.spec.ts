import { test, expect } from '@playwright/test';
import { HomePage, LoginModal, ProductPage, CartPage, OrderModal, OrderData } from '../pages';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test data from environment variables
const TEST_USERNAME = process.env.TEST_USERNAME || '';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '';
const PRODUCT_NAME = 'Sony vaio i5';

const orderData: OrderData = {
    name: process.env.ORDER_NAME || '',
    country: process.env.ORDER_COUNTRY || '',
    city: process.env.ORDER_CITY || '',
    card: process.env.ORDER_CARD || '',
    month: process.env.ORDER_MONTH || '',
    year: process.env.ORDER_YEAR || '',
};

test.describe('DemoBlaze Purchase Flow', () => {
    let homePage: HomePage;
    let loginModal: LoginModal;
    let productPage: ProductPage;
    let cartPage: CartPage;
    let orderModal: OrderModal;

    test.beforeEach(async ({ page }) => {
        // Initialize page objects
        homePage = new HomePage(page);
        loginModal = new LoginModal(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        orderModal = new OrderModal(page);
    });

    test('Complete purchase flow - Login, Add Sony Vaio i5 to Cart, and Place Order', async ({ page }) => {
        // Step 1: Navigate to homepage
        await test.step('Navigate to Homepage', async () => {
            await homePage.navigate();
            await expect(page).toHaveTitle(/STORE/);
        });

        // Step 2: Login with credentials
        await test.step('Login with credentials', async () => {
            await homePage.clickLogin();
            await loginModal.login(TEST_USERNAME, TEST_PASSWORD);

            // Verify login success
            const isLoggedIn = await homePage.isLoggedIn();
            expect(isLoggedIn).toBeTruthy();

            const welcomeMessage = await homePage.getWelcomeMessage();
            expect(welcomeMessage).toContain(TEST_USERNAME);
        });

        // Step 3: Select Laptops category
        await test.step('Select Laptops category', async () => {
            await homePage.selectCategory('Laptops');
            // Wait for products to load
            await page.waitForTimeout(1000);
        });

        // Step 4: Select Sony vaio i5 product
        await test.step('Select Sony vaio i5 product', async () => {
            await homePage.selectProduct(PRODUCT_NAME);

            // Verify we are on the product page
            const productTitle = await productPage.getProductName();
            expect(productTitle).toContain(PRODUCT_NAME);
        });

        // Step 5: Add to Cart and handle alert
        await test.step('Add product to Cart and handle alert', async () => {
            const alertMessage = await productPage.addToCart();

            // Verify alert message
            expect(alertMessage).toContain('Product added');
        });

        // Step 6: Navigate to Cart
        await test.step('Navigate to Cart', async () => {
            await homePage.goToCart();
            await cartPage.waitForCartLoad();
        });

        // Step 7: Verify item is in cart
        await test.step('Verify Sony vaio i5 is in cart', async () => {
            const isItemInCart = await cartPage.verifyItemInCart(PRODUCT_NAME);
            expect(isItemInCart).toBeTruthy();

            // Get cart items for additional verification
            const cartItems = await cartPage.getCartItems();
            console.log('Cart items:', cartItems);

            // Verify total price is not zero
            const totalPrice = await cartPage.getTotalPrice();
            expect(totalPrice).toBeGreaterThan(0);
        });

        // Step 8: Place Order
        await test.step('Place Order', async () => {
            await cartPage.placeOrder();
        });

        // Step 9: Fill order form and submit
        await test.step('Fill order form and submit', async () => {
            await orderModal.fillOrderForm(orderData);
            await orderModal.submitOrder();
        });

        // Step 10: Verify success message
        await test.step('Verify purchase success message', async () => {
            const successMessage = await orderModal.getSuccessMessage();

            // Assert success message
            expect(successMessage).toBe('Thank you for your purchase!');

            // Get order details for logging
            const orderDetails = await orderModal.getOrderDetails();
            console.log('Order details:', orderDetails);

            // Wait 5 seconds before taking screenshot
            await page.waitForTimeout(5000);

            // Take screenshot of success message
            await page.screenshot({ path: 'test-results/purchase-success.png', fullPage: true });

            // Close success modal
            await orderModal.closeSuccessModal();
        });
    });
});
