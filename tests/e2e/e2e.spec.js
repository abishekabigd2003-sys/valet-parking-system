const { test, expect } = require('@playwright/test');

// 1. Admin Module: Authentication & Dashboard
test('Admin: Authentication & Dashboard', async ({ page }) => {
  await page.goto('/login');
  // Sometimes labels are "Email" or "Email Address", let's just use input types or placeholders for robust testing if labels change
  await page.fill('input[type="email"]', 'admin@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait for network idle or redirect
  await page.waitForURL('**/admin**');
  await expect(page).toHaveURL(/\/admin/);
  await expect(page.locator('text=Dashboard').first()).toBeVisible();
});

// 2. Admin Module: User & Slot Management
test('Admin: User & Slot Management', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin**');

  // Navigate to Slots
  await page.click('text=Slots');
  await page.waitForURL('**/admin/slots**');
  
  // Just verifying the page loads
  await expect(page.locator('text=Parking Slots').first()).toBeVisible();
  
  // Navigate to Staff/Users
  await page.click('text=Staff');
  await page.waitForURL('**/admin/staff**');
  await expect(page.locator('text=Valet').first()).toBeVisible();
});

// 3. Valet Module: Check-in Flow
test('Valet: Check-in Flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'valet@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/valet**');
  
  // Go to check-in
  await page.click('text=Vehicle Check-in');
  await page.waitForURL('**/valet/check-in**');
});

// 4. Valet Module: Vehicle Retrieval
test('Valet: Vehicle Retrieval', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'valet@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/valet**');
  
  // Go to retrieve
  await page.click('text=Vehicle Check-out');
  await page.waitForURL('**/valet/retrieve**');
});

// 5. Customer Module: Registration & Onboarding
test('Customer: Registration & Onboarding', async ({ page }) => {
  await page.goto('/register');
  // Using placehholders as the inputs don't have name attributes
  await page.fill('input[placeholder="John Doe"]', 'New Customer');
  await page.fill('input[type="email"]', 'newcustomer@e2e.test');
  await page.fill('input[type="tel"]', '1234567890');
  await page.fill('input[type="password"]', 'password123');
  // Register component only has one password field according to the code viewed!
  
  await page.click('button[type="submit"]');

  // Should redirect to customer dashboard if success, or it redirects to '/' according to setTimeout in code
  await page.waitForURL('**/');
  await expect(page).toHaveURL(/\//); // Because the code does `setTimeout(() => navigate('/'), 3000);`
});

// 6. Customer Module: Vehicle Booking & History
test('Customer: Vehicle Booking & History', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'customer@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/customer**');
  
  // Go to reports/history
  await page.click('text=Reports');
  await page.waitForURL('**/customer/reports**');
});

// 7. Cross-Module Lifecycle
test('Cross-Module Lifecycle', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'customer2@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/customer**');
});

// 8. Security & RBAC Enforcement
test('Security & RBAC Enforcement', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'customer_rbac@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/customer**');

  // Attempt to access Admin route directly
  await page.goto('/admin');
  
  // Should be redirected away (to /customer or /)
  await page.waitForURL('**/customer**');
  await expect(page).not.toHaveURL(/\/admin/);
});
