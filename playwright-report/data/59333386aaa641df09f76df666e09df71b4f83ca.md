# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.js >> Valet: Multi-Vehicle Workflow & Retrieval
- Location: tests\e2e\e2e.spec.js:85:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=DEMO-001').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=DEMO-001').first()

```

```yaml
- banner:
  - text: ZEN PARK
  - button "Toggle Theme"
- complementary:
  - button
  - navigation:
    - link "Dashboard":
      - /url: /valet
    - link "Vehicle Check-in":
      - /url: /valet/check-in
    - link "Vehicle Check-out":
      - /url: /valet/retrieve
    - link "Manage Customers":
      - /url: /valet/customers
    - link "Manage Slots":
      - /url: /valet/slots
    - link "Reports":
      - /url: /valet/reports
    - link "Settings":
      - /url: /valet/settings
    - link "Profile":
      - /url: /valet/profile
  - text: E
  - paragraph: E2E User
  - paragraph: Valet
  - button "Logout"
- main:
  - heading "Retrieve Vehicle" [level=1]
  - paragraph: Search by ticket number or vehicle number to initiate checkout.
  - 'textbox "Enter Ticket # or Vehicle #"'
  - button "Search Record"
  - button "Scan QR Code"
```

# Test source

```ts
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
  43  |   await page.locator('label:has-text("Name") + input').fill('Demo Valet');
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
  77  |   await page.click('button:has-text("Add Customer")');
  78  |   await page.waitForTimeout(1000);
  79  | 
  80  |   // Verify Customer
  81  |   await expect(page.locator('text=Admin Created Customer').first()).toBeVisible();
  82  | });
  83  | 
  84  | // 3. Valet Module: Complete Demo Workflow (5 Vehicles)
  85  | test('Valet: Multi-Vehicle Workflow & Retrieval', async ({ page }) => {
  86  |   await page.goto('/login');
  87  |   await page.fill('input[type="email"]', 'valet@e2e.test');
  88  |   await page.fill('input[type="password"]', 'password123');
  89  |   await page.click('button[type="submit"]');
  90  | 
  91  |   await page.waitForURL('**/valet**');
  92  |   
  93  |   await page.click('text=Vehicle Check-in');
  94  |   await page.waitForURL('**/valet/check-in**');
  95  |   
  96  |   const vehicles = [
  97  |     { num: 'DEMO-001', type: 'Car', phone: '1111111110', name: 'Cust 1' },
  98  |     { num: 'DEMO-002', type: 'SUV', phone: '1111111111', name: 'Cust 2' },
  99  |     { num: 'DEMO-003', type: 'Bike', phone: '1111111112', name: 'Cust 3' },
  100 |     { num: 'DEMO-004', type: 'Car', phone: '1111111113', name: 'Cust 4' },
  101 |     { num: 'DEMO-005', type: 'Car', phone: '1111111114', name: 'Cust 5' },
  102 |   ];
  103 | 
  104 |   for (let i = 0; i < vehicles.length; i++) {
  105 |     const v = vehicles[i];
  106 |     
  107 |     // Fill Check-in form
  108 |     await page.locator('label:has-text("Mobile Number") + input').fill(v.phone);
  109 |     await page.locator('label:has-text("Customer Name") + input').fill(v.name);
  110 |     await page.locator('label:has-text("Vehicle Number") + input').fill(v.num);
  111 |     await page.locator('select').first().selectOption(v.type);
  112 |     
  113 |     await page.click('button:has-text("Assign Slot & Check-In")');
  114 |     await page.waitForTimeout(1500); // Wait for check-in process
  115 | 
  116 |     if (i < vehicles.length - 1) {
  117 |       await page.click('button:has-text("Check-In Another Vehicle")');
  118 |       await page.waitForTimeout(500);
  119 |     }
  120 |   }
  121 | 
  122 |   // Go to retrieve
  123 |   await page.click('text=Vehicle Check-out');
  124 |   await page.waitForURL('**/valet/retrieve**');
  125 | 
  126 |   // Verify at least one is in the Active table
> 127 |   await expect(page.locator('text=DEMO-001').first()).toBeVisible();
      |                                                       ^ Error: expect(locator).toBeVisible() failed
  128 | 
  129 |   // Process checkout for DEMO-001
  130 |   await page.locator('tr:has-text("DEMO-001")').locator('button:has-text("Process Checkout")').click();
  131 |   await page.waitForTimeout(1000);
  132 |   
  133 |   // In the modal, confirm payment/checkout
  134 |   await page.click('button:has-text("Complete Checkout")');
  135 |   await page.waitForTimeout(1500);
  136 | 
  137 |   // DEMO-001 should be gone from active list
  138 |   await expect(page.locator('tr:has-text("DEMO-001")')).toHaveCount(0);
  139 | });
  140 | 
  141 | // 4. Customer Module: Registration & Onboarding
  142 | test('Customer: Registration & Onboarding', async ({ page }) => {
  143 |   await page.goto('/register');
  144 |   await page.fill('input[placeholder="John Doe"]', 'New Customer');
  145 |   await page.fill('input[type="email"]', 'newcustomer@e2e.test');
  146 |   await page.fill('input[type="tel"]', '1234567890');
  147 |   await page.fill('input[type="password"]', 'password123');
  148 |   
  149 |   await page.click('button[type="submit"]');
  150 | 
  151 |   await page.waitForURL('**/');
  152 |   await expect(page).toHaveURL(/\//);
  153 | });
  154 | 
  155 | // 5. Customer Module: Vehicle Booking & History
  156 | test('Customer: Vehicle Booking & History', async ({ page }) => {
  157 |   await page.goto('/login');
  158 |   await page.fill('input[type="email"]', 'customer@e2e.test');
  159 |   await page.fill('input[type="password"]', 'password123');
  160 |   await page.click('button[type="submit"]');
  161 | 
  162 |   await page.waitForURL('**/customer**');
  163 |   
  164 |   await page.click('text=Reports');
  165 |   await page.waitForURL('**/customer/reports**');
  166 |   await expect(page.locator('text=Recent Parking History').first()).toBeVisible();
  167 | });
  168 | 
  169 | // 6. Cross-Module Lifecycle
  170 | test('Cross-Module Lifecycle', async ({ page }) => {
  171 |   await page.goto('/login');
  172 |   await page.fill('input[type="email"]', 'customer2@e2e.test');
  173 |   await page.fill('input[type="password"]', 'password123');
  174 |   await page.click('button[type="submit"]');
  175 |   await page.waitForURL('**/customer**');
  176 | });
  177 | 
  178 | // 7. Security & RBAC Enforcement
  179 | test('Security & RBAC Enforcement', async ({ page }) => {
  180 |   await page.goto('/login');
  181 |   await page.fill('input[type="email"]', 'customer_rbac@e2e.test');
  182 |   await page.fill('input[type="password"]', 'password123');
  183 |   await page.click('button[type="submit"]');
  184 |   await page.waitForURL('**/customer**');
  185 | 
  186 |   await page.goto('/admin');
  187 |   
  188 |   await page.waitForURL('**/customer**');
  189 |   await expect(page).not.toHaveURL(/\/admin/);
  190 | });
  191 | 
```