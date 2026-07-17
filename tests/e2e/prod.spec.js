const { test, expect } = require('@playwright/test');

// We use test.describe.serial because we are seeding data sequentially
test.describe.serial('Valet Parking System - Production E2E Suite', () => {

  const ts = Date.now().toString().slice(-6); // last 6 digits for uniqueness
  
  const valets = [
    { name: 'Valet Demo 1', email: `valet1_${ts}@e2e.test`, role: 'Valet' },
    { name: 'Valet Demo 2', email: `valet2_${ts}@e2e.test`, role: 'Valet' },
    { name: 'Valet Demo 3', email: `valet3_${ts}@e2e.test`, role: 'Valet' },
    { name: 'Valet Demo 4', email: `valet4_${ts}@e2e.test`, role: 'Valet' },
    { name: 'Valet Demo 5', email: `valet5_${ts}@e2e.test`, role: 'Valet' }
  ];

  const customers = [
    { name: 'Customer Demo 1', mobile: `11${ts.slice(0,8).padEnd(8,'0')}`, email: `customer1_${ts}@e2e.test` },
    { name: 'Customer Demo 2', mobile: `22${ts.slice(0,8).padEnd(8,'0')}`, email: `customer2_${ts}@e2e.test` },
    { name: 'Customer Demo 3', mobile: `33${ts.slice(0,8).padEnd(8,'0')}`, email: `customer3_${ts}@e2e.test` },
    { name: 'Customer Demo 4', mobile: `44${ts.slice(0,8).padEnd(8,'0')}`, email: `customer4_${ts}@e2e.test` },
    { name: 'Customer Demo 5', mobile: `55${ts.slice(0,8).padEnd(8,'0')}`, email: `customer5_${ts}@e2e.test` }
  ];

  const vehicles = [
    { num: `P-CA-${ts}`, type: 'Car', make: 'Toyota' },
    { num: `P-SU-${ts}`, type: 'SUV', make: 'Ford' },
    { num: `P-BI-${ts}`, type: 'Bike', make: 'Honda' },
    { num: `P-C4-${ts}`, type: 'Car', make: 'BMW' },
    { num: `P-S5-${ts}`, type: 'SUV', make: 'Jeep' },
    { num: `P-C6-${ts}`, type: 'Car', make: 'Tesla' },
    { num: `P-S7-${ts}`, type: 'SUV', make: 'Audi' },
    { num: `P-B8-${ts}`, type: 'Bike', make: 'Yamaha' },
    { num: `P-C9-${ts}`, type: 'Car', make: 'Kia' },
    { num: `P-S0-${ts}`, type: 'SUV', make: 'Volvo' }
  ];

  // 1. Admin Login & Dashboard Verification
  test('Scenario 1: Admin Login & Dashboard Verification', async ({ page }) => {
    await page.goto('https://valet-parking-system-qtci.onrender.com/login');
    await page.fill('input[type="email"]', 'admin_prod@e2e.test');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/admin');
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
    
    // Seed Slots if missing
    await page.click('text=Parking Slots');
    await page.waitForURL('**/admin/slots');
    
    const seedBtn = page.locator('button:has-text("Generate 40 Test Slots")');
    try {
      await seedBtn.waitFor({ state: 'visible', timeout: 3000 });
      await seedBtn.click();
      await page.waitForTimeout(2000);
    } catch(e) {
      // Already seeded
    }
  });

  // 1.5 Clean up existing demo data
  test('Scenario 1.5: Clean up existing demo data', async ({ page }) => {
    await page.goto('https://valet-parking-system-qtci.onrender.com/login');
    await page.fill('input[type="email"]', 'admin_prod@e2e.test');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    // Clean Staff
    await page.click('text=Staff');
    await page.waitForURL('**/admin/staff');
    page.on('dialog', dialog => dialog.accept());
    
    for (const valet of valets) {
      const row = page.locator('tr', { hasText: valet.email });
      if (await row.count() > 0) {
        await row.locator('button[title="Delete"]').click();
        await page.waitForTimeout(1000);
      }
    }

    // Clean Customers
    await page.click('text=Customers');
    await page.waitForURL('**/admin/customers');
    for (const customer of customers) {
      const row = page.locator('tr', { hasText: customer.email });
      if (await row.count() > 0) {
        // Customer deletion might not exist in UI? Wait, if there's no delete button, we can't delete them. 
        // Let's assume we can't delete customers from UI. We will use unique emails for customers.
      }
    }
  });

  // 2. Admin creates 5 Demo Valet Staff
  test('Scenario 2: Admin creates 5 Demo Valet Staff', async ({ page }) => {
    await page.goto('https://valet-parking-system-qtci.onrender.com/login');
    await page.fill('input[type="email"]', 'admin_prod@e2e.test');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    await page.click('text=Staff');
    await page.waitForURL('**/admin/staff');

    for (const valet of valets) {
      await page.click('text=+ Add Staff');
      await page.locator('label:has-text("Name") + input').fill(valet.name);
      await page.locator('label:has-text("Email") + input').fill(valet.email);
      await page.locator('label:has-text("Password") + input').fill('password123');
      await page.locator('form button:has-text("Add Staff")').click();
      await page.waitForTimeout(1000); // Wait for modal to close
    }

    // Verify they exist
    for (const valet of valets) {
      await expect(page.locator(`text=${valet.email}`).first()).toBeVisible();
    }
  });

  // 3. Admin creates 5 Demo Customers
  test('Scenario 3: Admin creates 5 Demo Customers', async ({ page }) => {
    await page.goto('https://valet-parking-system-qtci.onrender.com/login');
    await page.fill('input[type="email"]', 'admin_prod@e2e.test');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    await page.click('text=Customers');
    await page.waitForURL('**/admin/customers');

    for (const customer of customers) {
      await page.click('text=+ Add Customer');
      await page.locator('label:has-text("Name") + input').fill(customer.name);
      await page.locator('label:has-text("Mobile Number") + input').fill(customer.mobile);
      await page.locator('label:has-text("Email") + input').fill(customer.email);
      await page.locator('form button:has-text("Add Customer")').click();
      await page.waitForTimeout(1000);
    }

    // Verify they exist
    for (const customer of customers) {
      await expect(page.locator(`text=${customer.email}`).first()).toBeVisible();
    }
  });

  // 4. Admin Edit & Delete Staff
  test('Scenario 4: Admin Edit & Delete Staff Verification', async ({ page }) => {
    await page.goto('https://valet-parking-system-qtci.onrender.com/login');
    await page.fill('input[type="email"]', 'admin_prod@e2e.test');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    await page.click('text=Staff');
    await page.waitForURL('**/admin/staff');

    // Create a temporary staff to edit and delete
    await page.click('text=+ Add Staff');
    await page.locator('label:has-text("Name") + input').fill('Temp Staff');
    await page.locator('label:has-text("Email") + input').fill('temp@e2e.test');
    await page.locator('label:has-text("Password") + input').fill('password123');
    await page.locator('form button:has-text("Add Staff")').click();
    await page.waitForTimeout(1000);

    // Edit it
    const row = page.locator('tr', { hasText: 'temp@e2e.test' });
    await row.locator('button[title="Edit"]').click();
    await page.locator('label:has-text("Name") + input').fill('Temp Staff Edited');
    await page.locator('form button:has-text("Save Changes")').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Temp Staff Edited').first()).toBeVisible();

    // Delete it
    page.on('dialog', dialog => dialog.accept());
    await row.locator('button[title="Delete"]').click();
    await page.waitForTimeout(500);
    await expect(page.locator('text=temp@e2e.test')).toHaveCount(0);
  });

  // 5. Customer Login & Dashboard
  test('Scenario 5: Customer Login & Dashboard', async ({ page }) => {
    await page.goto('https://valet-parking-system-qtci.onrender.com/login');
    await page.fill('input[type="email"]', customers[0].email);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/customer');
    await expect(page.locator('text=Welcome back').first()).toBeVisible();
  });

  // 6. Valet checks in 10 Demo Vehicles
  test('Scenario 6: Valet checks in 10 Demo Vehicles', async ({ page }) => {
    await page.goto('https://valet-parking-system-qtci.onrender.com/login');
    await page.fill('input[type="email"]', valets[0].email);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/valet');

    await page.click('text=Vehicle Check-in');
    await page.waitForURL('**/valet/check-in');

    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      // Use existing customer mobile
      const customer = customers[i % customers.length];

      await page.fill('input[placeholder="Customer Name"]', customer.name);
      await page.fill('input[placeholder="Mobile Number"]', customer.mobile);
      await page.fill('input[placeholder="Vehicle Number"]', v.num);
      await page.selectOption('select', { label: v.type });
      
      await page.click('button:has-text("Check-in Vehicle")');
      
      // Wait for success modal
      await expect(page.locator('text=Vehicle successfully parked at slot').first()).toBeVisible();
      await page.click('button:has-text("Check-in Another Vehicle")');
    }
  });

  // 7. Valet checks out a vehicle and processes payment
  test('Scenario 7: Valet checks out a vehicle and processes payment', async ({ page }) => {
    await page.goto('https://valet-parking-system-qtci.onrender.com/login');
    await page.fill('input[type="email"]', valets[0].email);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/valet');

    await page.click('text=Vehicle Check-out');
    await page.waitForURL('**/valet/retrieve');

    // Search for first vehicle
    await page.fill('input[placeholder="Enter Ticket # or Vehicle #"]', vehicles[0].num);
    await page.click('button:has-text("Search Record")');
    
    // Wait for the action buttons
    await expect(page.locator('button:has-text("Mark as Retrieved & Calculate Fee")').first()).toBeVisible();
    await page.click('button:has-text("Mark as Retrieved & Calculate Fee")');

    // Process Payment
    await page.selectOption('select', { label: 'Cash' });
    await page.click('button:has-text("Confirm Payment")');
    
    // Success
    await expect(page.locator('text=Payment successful').first()).toBeVisible();
    await page.click('button:has-text("Close")');
  });

  // 8. Valet errors out on invalid ticket retrieval
  test('Scenario 8: Valet errors out on invalid ticket retrieval', async ({ page }) => {
    await page.goto('https://valet-parking-system-qtci.onrender.com/login');
    await page.fill('input[type="email"]', valets[1].email);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/valet');

    await page.click('text=Vehicle Check-out');
    await page.waitForURL('**/valet/retrieve');

    await page.fill('input[placeholder="Enter Ticket # or Vehicle #"]', 'NON-EXISTENT-V');
    await page.click('button:has-text("Search Record")');
    
    await expect(page.locator('text=No active parking record found.').first()).toBeVisible();
  });

  // 9. Admin verifies reports and database consistency
  test('Scenario 9: Admin verifies reports and database consistency', async ({ page }) => {
    await page.goto('https://valet-parking-system-qtci.onrender.com/login');
    await page.fill('input[type="email"]', 'admin_prod@e2e.test');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    await page.click('text=Reports');
    await page.waitForURL('**/admin/reports');

    // Verify the charts are rendered
    await expect(page.locator('canvas').first()).toBeVisible();

    await page.click('text=Payments');
    await page.waitForURL('**/admin/payments');
    
    // Verify there is at least one completed payment (from scenario 7)
    await expect(page.locator('text=Completed').first()).toBeVisible();
  });

  // 10. Role-Based Access Control Enforcement
  test('Scenario 10: Role-Based Access Control Enforcement', async ({ page }) => {
    // Login as Customer
    await page.goto('https://valet-parking-system-qtci.onrender.com/login');
    await page.fill('input[type="email"]', customers[0].email);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/customer');

    // Attempt to access admin routes directly
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/customer/);

    await page.goto('/valet');
    await expect(page).toHaveURL(/.*\/customer/);
  });

});
