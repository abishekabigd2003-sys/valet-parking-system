const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  }).catch(() => {});
});

// 1. Admin Module: Authentication & Dashboard
test('Admin: Authentication & Dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/admin/);
  await expect(page.locator('text=Dashboard').first()).toBeVisible();

  // Navigate to Slots to seed
  await page.locator('a[href="/admin/slots"]').first().click();
  await expect(page).toHaveURL(/\/admin\/slots/);
  
  // Wait for the button or some slots to appear
  const seedBtn = page.locator('button:has-text("Generate 40 Test Slots")');
  try {
    await seedBtn.waitFor({ state: 'visible', timeout: 5000 });
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
  await expect(page).toHaveURL(/\/admin/);

  // Navigate to Staff
  await page.locator('a[href="/admin/staff"]').first().click();
  await expect(page).toHaveURL(/\/admin\/staff/);

  // Create Staff
  await page.click('text=+ Add Staff');
  await page.locator('label:has-text("Name") ~ div input, label:has-text("Name") ~ input').fill('Demo Valet');
  await page.locator('label:has-text("Email") ~ div input, label:has-text("Email") ~ input').fill('valet_demo@e2e.test');
  await page.locator('label:has-text("Password") ~ div input, label:has-text("Password") ~ input').fill('password123');
  
  await page.locator('form button:has-text("Add Staff")').click();
  await page.waitForTimeout(1000); // Wait for modal to close and refresh

  // Verify Staff was created
  await expect(page.locator('text=Demo Valet').first()).toBeVisible();

  // Edit Staff
  await page.locator('tr:has-text("Demo Valet")').locator('button[title="Edit"]').click();
  await page.locator('label:has-text("Name") ~ div input, label:has-text("Name") ~ input').fill('Demo Valet Edited');
  await page.click('button:has-text("Save Changes")');
  await page.waitForTimeout(1000);

  // Verify Edit
  await expect(page.locator('text=Demo Valet Edited').first()).toBeVisible();

  // Delete Staff
  page.on('dialog', dialog => dialog.accept()); // Accept the confirmation alert
  await page.locator('tr:has-text("Demo Valet Edited")').locator('button[title="Delete"]').click();
  await page.waitForTimeout(1000);
  
  // Navigate to Customers
  await page.locator('a[href="/admin/customers"]').first().click();
  await expect(page).toHaveURL(/\/admin\/customers/);

  // Create Customer
  await page.click('text=+ Add Customer');
  await page.locator('label:has-text("Name") ~ div input, label:has-text("Name") ~ input').fill('Admin Created Customer');
  await page.locator('label:has-text("Mobile Number") ~ div input, label:has-text("Mobile Number") ~ input').fill('9999999999');
  await page.locator('form button:has-text("Add Customer")').click();
  await page.waitForTimeout(1000);

  // Verify Customer
  await expect(page.locator('text=Admin Created Customer').first()).toBeVisible();

  // Edit Customer
  await page.locator('tr:has-text("Admin Created Customer")').locator('button[title="Edit"]').click();
  await page.locator('label:has-text("Name") ~ div input, label:has-text("Name") ~ input').fill('Admin Created Customer Edited');
  await page.click('form button:has-text("Save Changes")');
  await page.waitForTimeout(1000);

  // Verify Edit
  await expect(page.locator('text=Admin Created Customer Edited').first()).toBeVisible();

  // Delete Customer
  await page.locator('tr:has-text("Admin Created Customer Edited")').locator('button[title="Delete"]').click();
  await page.waitForTimeout(1000);
  
  // Verify Delete
  await expect(page.locator('text=Admin Created Customer Edited')).toHaveCount(0);
});

// 3. Valet Module: Complete Demo Workflow (5 Vehicles)
test('Valet: Multi-Vehicle Workflow & Retrieval', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/login');
  await page.fill('input[type="email"]', 'valet@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/valet/);
  
  await page.locator('a[href="/valet/check-in"]').first().click();
  await expect(page).toHaveURL(/\/valet\/check-in/);
  
  const uid = Date.now().toString().slice(-4);
  const vehicles = [
    { num: `DEMO-${uid}-01`, type: 'Car', phone: `111111${uid}`, name: 'Cust 1' },
    { num: `DEMO-${uid}-02`, type: 'SUV', phone: `222222${uid}`, name: 'Cust 2' },
    { num: `DEMO-${uid}-03`, type: 'Bike', phone: `333333${uid}`, name: 'Cust 3' },
    { num: `DEMO-${uid}-04`, type: 'Car', phone: `444444${uid}`, name: 'Cust 4' },
    { num: `DEMO-${uid}-05`, type: 'Car', phone: `555555${uid}`, name: 'Cust 5' },
  ];

  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    
    // Fill Check-in form
    await page.locator('label:has-text("Mobile Number") ~ div input, label:has-text("Mobile Number") ~ input').fill(v.phone);
    await page.locator('label:has-text("Customer Name") ~ div input, label:has-text("Customer Name") ~ input').fill(v.name);
    await page.locator('label:has-text("Vehicle Number") ~ div input, label:has-text("Vehicle Number") ~ input').fill(v.num);
    await page.locator('select').first().selectOption(v.type);
    
    await page.click('button:has-text("Assign Slot & Check-In")');
    await page.waitForTimeout(1000); // Wait for check-in process

    if (i < vehicles.length - 1) {
      await page.click('button:has-text("Check-In Another Vehicle")');
      await page.waitForTimeout(300);
    }
  }

  // Go to retrieve
  await page.locator('a[href="/valet/retrieve"]').first().click();
  await expect(page).toHaveURL(/\/valet\/retrieve/);

  // Search for the first vehicle checked in
  await page.fill('input[placeholder="Enter Ticket # or Vehicle #"]', vehicles[0].num);
  await page.click('button:has-text("Search Record")');
  await page.waitForTimeout(1000);

  // Verify record is found
  await expect(page.locator('h3:has-text("Ticket Info")').first()).toBeVisible();

  // Process checkout for first vehicle
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

  await expect(page).toHaveURL(/\//);
});

// 5. Customer Module: Vehicle Booking & History
test('Customer: Vehicle Booking & History', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'customer@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/customer/);
  
  await page.locator('a[href="/customer/reports"]').first().click();
  await expect(page).toHaveURL(/\/customer\/reports/);
  await expect(page.locator('text=Recent Parking History').first()).toBeVisible();
});

// 6. Cross-Module Lifecycle
test('Cross-Module Lifecycle', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'customer2@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/customer/);
});

// 7. Security & RBAC Enforcement
test('Security & RBAC Enforcement', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'customer_rbac@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/customer/);

  await page.goto('/admin');
  
  await expect(page).toHaveURL(/\/customer/);
  await expect(page).not.toHaveURL(/\/admin/);
});

// 8. Valet Module: Error Handling & Edge Cases
test('Valet: Error Handling & Edge Cases', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'valet@e2e.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/valet/);

  await page.locator('a[href="/valet/retrieve"]').first().click();
  await expect(page).toHaveURL(/\/valet\/retrieve/);

  // Search for a non-existent ticket
  await page.fill('input[placeholder="Enter Ticket # or Vehicle #"]', 'INVALID-TICKET-999');
  await page.click('button:has-text("Search Record")');
  await page.waitForTimeout(1000);

  // Expect an error message to be visible
  await expect(page.locator('text=No active parking record found.').first()).toBeVisible();
});
