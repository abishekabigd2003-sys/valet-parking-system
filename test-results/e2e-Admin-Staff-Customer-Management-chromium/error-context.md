# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.js >> Admin: Staff & Customer Management
- Location: tests\e2e\e2e.spec.js:30:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('label:has-text("Name") + input')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - banner [ref=e5]:
      - generic [ref=e7]:
        - img [ref=e9]
        - generic [ref=e12]: ZEN PARK
      - button "Toggle Theme" [ref=e14] [cursor=pointer]:
        - img [ref=e15]
    - generic [ref=e21]:
      - complementary [ref=e22]:
        - button [ref=e23] [cursor=pointer]:
          - img [ref=e24]
        - navigation [ref=e26]:
          - link "Dashboard" [ref=e27] [cursor=pointer]:
            - /url: /admin
            - img [ref=e28]
            - generic [ref=e33]: Dashboard
          - link "Vehicles" [ref=e34] [cursor=pointer]:
            - /url: /admin/vehicles
            - img [ref=e35]
            - generic [ref=e38]: Vehicles
          - link "Parking Slots" [ref=e39] [cursor=pointer]:
            - /url: /admin/slots
            - img [ref=e40]
            - generic [ref=e42]: Parking Slots
          - link "Customers" [ref=e43] [cursor=pointer]:
            - /url: /admin/customers
            - img [ref=e44]
            - generic [ref=e49]: Customers
          - link "Staff" [ref=e50] [cursor=pointer]:
            - /url: /admin/staff
            - img [ref=e51]
            - generic [ref=e63]: Staff
          - link "Reports" [ref=e64] [cursor=pointer]:
            - /url: /admin/reports
            - img [ref=e65]
            - generic [ref=e67]: Reports
          - link "Payments" [ref=e68] [cursor=pointer]:
            - /url: /admin/payments
            - img [ref=e69]
            - generic [ref=e71]: Payments
          - link "Settings" [ref=e72] [cursor=pointer]:
            - /url: /admin/settings
            - img [ref=e73]
            - generic [ref=e76]: Settings
          - link "Profile" [ref=e77] [cursor=pointer]:
            - /url: /admin/profile
            - img [ref=e78]
            - generic [ref=e82]: Profile
        - generic [ref=e83]:
          - generic [ref=e84]:
            - generic [ref=e85]: E
            - generic [ref=e86]:
              - paragraph [ref=e87]: E2E User
              - paragraph [ref=e88]: Admin
          - button "Logout" [ref=e89] [cursor=pointer]:
            - img [ref=e90]
            - generic [ref=e93]: Logout
      - main [ref=e94]:
        - generic [ref=e96]:
          - generic [ref=e97]:
            - generic [ref=e98]:
              - heading "Staff Management" [level=1] [ref=e99]
              - paragraph [ref=e100]: View and manage all system users.
            - generic [ref=e101]:
              - button "Refresh" [ref=e102] [cursor=pointer]:
                - img [ref=e103]
                - text: Refresh
              - button "Export to Excel (CSV)" [ref=e108] [cursor=pointer]:
                - img [ref=e109]
                - text: Export to Excel (CSV)
              - button "+ Add Staff" [active] [ref=e112] [cursor=pointer]
          - table [ref=e115]:
            - rowgroup [ref=e116]:
              - row "Name Email Role Status Joined Actions" [ref=e117]:
                - columnheader "Name" [ref=e118]
                - columnheader "Email" [ref=e119]
                - columnheader "Role" [ref=e120]
                - columnheader "Status" [ref=e121]
                - columnheader "Joined" [ref=e122]
                - columnheader "Actions" [ref=e123]
            - rowgroup [ref=e124]:
              - row "E2E User admin@e2e.test Admin Active Jul 17, 2026" [ref=e125]:
                - cell "E2E User" [ref=e126]
                - cell "admin@e2e.test" [ref=e127]
                - cell "Admin" [ref=e128]
                - cell "Active" [ref=e129]
                - cell "Jul 17, 2026" [ref=e130]
                - cell [ref=e131]:
                  - button "Edit" [ref=e132] [cursor=pointer]:
                    - img [ref=e133]
                  - button "Delete" [ref=e135] [cursor=pointer]:
                    - img [ref=e136]
          - generic [ref=e140]:
            - heading "Add New Staff" [level=2] [ref=e141]
            - generic [ref=e142]:
              - generic [ref=e143]:
                - generic [ref=e144]: Name
                - textbox [ref=e146]
              - generic [ref=e147]:
                - generic [ref=e148]: Email
                - textbox [ref=e150]
              - generic [ref=e151]:
                - generic [ref=e152]: Password
                - generic [ref=e153]:
                  - textbox [ref=e154]
                  - button "Show password" [ref=e155] [cursor=pointer]:
                    - img [ref=e156]
              - generic [ref=e160]:
                - generic [ref=e161]: Role
                - combobox [ref=e162]:
                  - option "Valet Staff" [selected]
                  - option "Admin"
              - generic [ref=e163]:
                - button "Cancel" [ref=e164] [cursor=pointer]
                - button "Add Staff" [ref=e165] [cursor=pointer]
  - generic [ref=e166]: ₹0
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | // 1. Admin Module: Authentication & Dashboard
  4   | test('Admin: Authentication & Dashboard', async ({ page }) => {
  5   |   await page.goto('/login');
  6   |   await page.fill('input[type="email"]', 'admin@e2e.test');
  7   |   await page.fill('input[type="password"]', 'password123');
  8   |   await page.click('button[type="submit"]');
  9   | 
  10  |   await page.waitForURL('**/admin**');
  11  |   await expect(page).toHaveURL(/\/admin/);
  12  |   await expect(page.locator('text=Dashboard').first()).toBeVisible();
  13  | 
  14  |   // Navigate to Slots to seed
  15  |   await page.click('text=Slots');
  16  |   await page.waitForURL('**/admin/slots**');
  17  |   
  18  |   // Wait for the button or some slots to appear
  19  |   const seedBtn = page.locator('button:has-text("Generate 40 Test Slots")');
  20  |   try {
  21  |     await seedBtn.waitFor({ state: 'visible', timeout: 3000 });
  22  |     await seedBtn.click();
  23  |     await page.waitForTimeout(2000); // wait for seed to complete
  24  |   } catch (e) {
  25  |     // Button didn't appear, meaning slots are already seeded
  26  |   }
  27  | });
  28  | 
  29  | // 2. Admin Module: User (Staff & Customer) Management
  30  | test('Admin: Staff & Customer Management', async ({ page }) => {
  31  |   await page.goto('/login');
  32  |   await page.fill('input[type="email"]', 'admin@e2e.test');
  33  |   await page.fill('input[type="password"]', 'password123');
  34  |   await page.click('button[type="submit"]');
  35  |   await page.waitForURL('**/admin**');
  36  | 
  37  |   // Navigate to Staff
  38  |   await page.click('text=Staff');
  39  |   await page.waitForURL('**/admin/staff**');
  40  | 
  41  |   // Create Staff
  42  |   await page.click('text=+ Add Staff');
> 43  |   await page.locator('label:has-text("Name") + input').fill('Demo Valet');
      |                                                        ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  44  |   await page.locator('label:has-text("Email") + input').fill('valet_demo@e2e.test');
  45  |   await page.locator('label:has-text("Password") + input').fill('password123');
  46  |   
  47  |   await page.locator('form button:has-text("Add Staff")').click();
  48  |   await page.waitForTimeout(1000); // Wait for modal to close and refresh
  49  | 
  50  |   // Verify Staff was created
  51  |   await expect(page.locator('text=Demo Valet').first()).toBeVisible();
  52  | 
  53  |   // Edit Staff
  54  |   // Using the first edit button on the row containing Demo Valet
  55  |   await page.locator('tr:has-text("Demo Valet")').locator('button[title="Edit"]').click();
  56  |   // Change name
  57  |   await page.locator('label:has-text("Name") + input').fill('Demo Valet Edited');
  58  |   await page.click('button:has-text("Save Changes")');
  59  |   await page.waitForTimeout(1000);
  60  | 
  61  |   // Verify Edit
  62  |   await expect(page.locator('text=Demo Valet Edited').first()).toBeVisible();
  63  | 
  64  |   // Delete Staff
  65  |   page.on('dialog', dialog => dialog.accept()); // Accept the confirmation alert
  66  |   await page.locator('tr:has-text("Demo Valet Edited")').locator('button[title="Delete"]').click();
  67  |   await page.waitForTimeout(1000);
  68  |   
  69  |   // Navigate to Customers
  70  |   await page.click('text=Customers');
  71  |   await page.waitForURL('**/admin/customers**');
  72  | 
  73  |   // Create Customer
  74  |   await page.click('text=+ Add Customer');
  75  |   await page.locator('label:has-text("Name") + input').fill('Admin Created Customer');
  76  |   await page.locator('label:has-text("Mobile Number") + input').fill('9999999999');
  77  |   await page.locator('form button:has-text("Add Customer")').click();
  78  |   await page.waitForTimeout(1000);
  79  | 
  80  |   // Verify Customer
  81  |   await expect(page.locator('text=Admin Created Customer').first()).toBeVisible();
  82  | 
  83  |   // Edit Customer
  84  |   await page.locator('tr:has-text("Admin Created Customer")').locator('button[title="Edit"]').click();
  85  |   await page.locator('label:has-text("Name") + input').fill('Admin Created Customer Edited');
  86  |   await page.click('form button:has-text("Save Changes")');
  87  |   await page.waitForTimeout(1000);
  88  | 
  89  |   // Verify Edit
  90  |   await expect(page.locator('text=Admin Created Customer Edited').first()).toBeVisible();
  91  | 
  92  |   // Delete Customer
  93  |   await page.locator('tr:has-text("Admin Created Customer Edited")').locator('button[title="Delete"]').click();
  94  |   await page.waitForTimeout(1000);
  95  |   
  96  |   // Verify Delete
  97  |   await expect(page.locator('text=Admin Created Customer Edited')).toHaveCount(0);
  98  | });
  99  | 
  100 | // 3. Valet Module: Complete Demo Workflow (5 Vehicles)
  101 | test('Valet: Multi-Vehicle Workflow & Retrieval', async ({ page }) => {
  102 |   await page.goto('/login');
  103 |   await page.fill('input[type="email"]', 'valet@e2e.test');
  104 |   await page.fill('input[type="password"]', 'password123');
  105 |   await page.click('button[type="submit"]');
  106 | 
  107 |   await page.waitForURL('**/valet**');
  108 |   
  109 |   await page.click('text=Vehicle Check-in');
  110 |   await page.waitForURL('**/valet/check-in**');
  111 |   
  112 |   const vehicles = [
  113 |     { num: 'DEMO-001', type: 'Car', phone: '1111111110', name: 'Cust 1' },
  114 |     { num: 'DEMO-002', type: 'SUV', phone: '1111111111', name: 'Cust 2' },
  115 |     { num: 'DEMO-003', type: 'Bike', phone: '1111111112', name: 'Cust 3' },
  116 |     { num: 'DEMO-004', type: 'Car', phone: '1111111113', name: 'Cust 4' },
  117 |     { num: 'DEMO-005', type: 'Car', phone: '1111111114', name: 'Cust 5' },
  118 |   ];
  119 | 
  120 |   for (let i = 0; i < vehicles.length; i++) {
  121 |     const v = vehicles[i];
  122 |     
  123 |     // Fill Check-in form
  124 |     await page.locator('label:has-text("Mobile Number") + input').fill(v.phone);
  125 |     await page.locator('label:has-text("Customer Name") + input').fill(v.name);
  126 |     await page.locator('label:has-text("Vehicle Number") + input').fill(v.num);
  127 |     await page.locator('select').first().selectOption(v.type);
  128 |     
  129 |     await page.click('button:has-text("Assign Slot & Check-In")');
  130 |     await page.waitForTimeout(1500); // Wait for check-in process
  131 | 
  132 |     if (i < vehicles.length - 1) {
  133 |       await page.click('button:has-text("Check-In Another Vehicle")');
  134 |       await page.waitForTimeout(500);
  135 |     }
  136 |   }
  137 | 
  138 |   // Go to retrieve
  139 |   await page.click('text=Vehicle Check-out');
  140 |   await page.waitForURL('**/valet/retrieve**');
  141 | 
  142 |   // Search for DEMO-001
  143 |   await page.fill('input[placeholder="Enter Ticket # or Vehicle #"]', 'DEMO-001');
```