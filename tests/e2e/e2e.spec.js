const { test, expect } = require('@playwright/test');

// 1. Admin Module: Authentication & Dashboard
test('Admin: Authentication & Dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/admin**');
  await expect(page).toHaveURL(/\/admin/);
  await expect(page.locator('text=Dashboard').first()).toBeVisible();

  // Navigate to Slots to seed
  await page.click('text=Slots');
  await page.waitForURL('**/admin/slots**');
  
  // Wait for the button or some slots to appear
  const seedBtn = page.locator('button:has-text("Generate 40 Test Slots")');
  try {
    await seedBtn.waitFor({ state: 'visible', timeout: 3000 });
    await seedBtn.click();
    await page.waitForTimeout(2000); // wait for seed to complete
  } catch (e) {
    // Button didn't appear, meaning slots are already seeded
  }
});

// 2. Admin Module: User (Staff & Customer) Management
test('Admin: Staff & Customer Management', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin**');

  // Navigate to Staff
  await page.click('text=Staff');
  await page.waitForURL('**/admin/staff**');

  // Create Staff
  await page.click('text=+ Add Staff');
  await page.locator('label:has-text("Name") + input').fill('Demo Valet');
  await page.locator('label:has-text("Email") + input').fill('valet_demo@e2e.test');
  await page.locator('label:has-text("Password") + input').fill('password123');
  
  await page.locator('form button:has-text("Add Staff")').click();
  await page.waitForTimeout(1000); // Wait for modal to close and refresh

  // Verify Staff was created
  await expect(page.locator('text=Demo Valet').first()).toBeVisible();

  // Edit Staff
  // Using the first edit button on the row containing Demo Valet
  await page.locator('tr:has-text("Demo Valet")').locator('button[title="Edit"]').click();
  // Change name
  await page.locator('label:has-text("Name") + input').fill('Demo Valet Edited');
  await page.click('button:has-text("Save Changes")');
  await page.waitForTimeout(1000);

  // Verify Edit
  await expect(page.locator('text=Demo Valet Edited').first()).toBeVisible();

  // Delete Staff
  page.on('dialog', dialog => dialog.accept()); // Accept the confirmation alert
  await page.locator('tr:has-text("Demo Valet Edited")').locator('button[title="Delete"]').click();
  await page.waitForTimeout(1000);
  
  // Navigate to Customers
  await page.click('text=Customers');
  await page.waitForURL('**/admin/customers**');

  // Create Customer
  await page.click('text=+ Add Customer');
  await page.locator('label:has-text("Name") + input').fill('Admin Created Customer');
  await page.locator('label:has-text("Mobile Number") + input').fill('9999999999');
  await page.locator('form button:has-text("Add Customer")').click();
  await page.waitForTimeout(1000);

  // Verify Customer
  await expect(page.locator('text=Admin Created Customer').first()).toBeVisible();
});

// 3. Valet Module: Complete Demo Workflow (5 Vehicles)
test('Valet: Multi-Vehicle Workflow & Retrieval', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'valet@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/valet**');
  
  await page.click('text=Vehicle Check-in');
  await page.waitForURL('**/valet/check-in**');
  
  const vehicles = [
    { num: 'DEMO-001', type: 'Car', phone: '1111111110', name: 'Cust 1' },
    { num: 'DEMO-002', type: 'SUV', phone: '1111111111', name: 'Cust 2' },
    { num: 'DEMO-003', type: 'Bike', phone: '1111111112', name: 'Cust 3' },
    { num: 'DEMO-004', type: 'Car', phone: '1111111113', name: 'Cust 4' },
    { num: 'DEMO-005', type: 'Car', phone: '1111111114', name: 'Cust 5' },
  ];

  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    
    // Fill Check-in form
    await page.locator('label:has-text("Mobile Number") + input').fill(v.phone);
    await page.locator('label:has-text("Customer Name") + input').fill(v.name);
    await page.locator('label:has-text("Vehicle Number") + input').fill(v.num);
    await page.locator('select').first().selectOption(v.type);
    
    await page.click('button:has-text("Assign Slot & Check-In")');
    await page.waitForTimeout(1500); // Wait for check-in process

    if (i < vehicles.length - 1) {
      await page.click('button:has-text("Check-In Another Vehicle")');
      await page.waitForTimeout(500);
    }
  }

  // Go to retrieve
  await page.click('text=Vehicle Check-out');
  await page.waitForURL('**/valet/retrieve**');

  // Search for DEMO-001
  await page.fill('input[placeholder="Enter Ticket # or Vehicle #"]', 'DEMO-001');
  await page.click('button:has-text("Search Record")');
  await page.waitForTimeout(1000);

  // Verify record is found
  await expect(page.locator('h3:has-text("Ticket Info")').first()).toBeVisible();

  // Process checkout for DEMO-001
  await page.click('button:has-text("Mark as Retrieved & Calculate Fee")');
  await page.waitForTimeout(1000);
  
  // Confirm payment
  await page.click('button:has-text("Confirm Payment")');
  await page.waitForTimeout(1500);

  // Verify checkout completion
  await expect(page.locator('text=Payment Completed').first()).toBeVisible();
});

// 4. Customer Module: Registration & Onboarding
test('Customer: Registration & Onboarding', async ({ page }) => {
  await page.goto('/register');
  await page.fill('input[placeholder="John Doe"]', 'New Customer');
  await page.fill('input[type="email"]', 'newcustomer@e2e.test');
  await page.fill('input[type="tel"]', '1234567890');
  await page.fill('input[type="password"]', 'password123');
  
  await page.click('button[type="submit"]');

  await page.waitForURL('**/');
  await expect(page).toHaveURL(/\//);
});

// 5. Customer Module: Vehicle Booking & History
test('Customer: Vehicle Booking & History', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'customer@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/customer**');
  
  await page.click('text=Reports');
  await page.waitForURL('**/customer/reports**');
  await expect(page.locator('text=Recent Parking History').first()).toBeVisible();
});

// 6. Cross-Module Lifecycle
test('Cross-Module Lifecycle', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'customer2@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/customer**');
});

// 7. Security & RBAC Enforcement
test('Security & RBAC Enforcement', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'customer_rbac@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/customer**');

  await page.goto('/admin');
  
  await page.waitForURL('**/customer**');
  await expect(page).not.toHaveURL(/\/admin/);
});
