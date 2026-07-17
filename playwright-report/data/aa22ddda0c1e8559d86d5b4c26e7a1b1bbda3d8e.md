# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: prod.spec.js >> Valet Parking System - Production E2E Suite >> Scenario 9: Admin verifies reports and database consistency
- Location: tests\e2e\prod.spec.js:269:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('canvas').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('canvas').first()

```

```yaml
- banner:
  - text: ZEN PARK
  - button "Toggle Theme"
- complementary:
  - button
  - navigation:
    - link "Dashboard":
      - /url: /admin
    - link "Vehicles":
      - /url: /admin/vehicles
    - link "Parking Slots":
      - /url: /admin/slots
    - link "Customers":
      - /url: /admin/customers
    - link "Staff":
      - /url: /admin/staff
    - link "Reports":
      - /url: /admin/reports
    - link "Payments":
      - /url: /admin/payments
    - link "Settings":
      - /url: /admin/settings
    - link "Profile":
      - /url: /admin/profile
  - text: E
  - paragraph: E2E User
  - paragraph: Admin
  - button "Logout"
- main:
  - heading "Reports & Analytics" [level=1]
  - paragraph: View detailed reports on occupancy, revenue, and entries.
  - button "Refresh"
  - button "Export to Excel (CSV)"
  - heading "Occupancy Report" [level=3]
  - application: Occupied Available 0 6 12 18 24
  - heading "Revenue Summary" [level=3]
  - paragraph: Total Revenue Collected
  - heading "₹50" [level=2]
  - paragraph: +12% from last month
  - heading "Recent Vehicle Entries / Exits" [level=3]
  - table:
    - rowgroup:
      - row "Ticket Vehicle Customer Status":
        - columnheader "Ticket"
        - columnheader "Vehicle"
        - columnheader "Customer"
        - columnheader "Status"
    - rowgroup:
      - row "TKT-1784268462249-916 Customer Demo 5 Parked":
        - cell "TKT-1784268462249-916"
        - cell
        - cell "Customer Demo 5"
        - cell "Parked"
      - row "TKT-1784268459203-106 Customer Demo 4 Parked":
        - cell "TKT-1784268459203-106"
        - cell
        - cell "Customer Demo 4"
        - cell "Parked"
      - row "TKT-1784268456131-484 Customer Demo 3 Parked":
        - cell "TKT-1784268456131-484"
        - cell
        - cell "Customer Demo 3"
        - cell "Parked"
      - row "TKT-1784268453305-477 Customer Demo 2 Parked":
        - cell "TKT-1784268453305-477"
        - cell
        - cell "Customer Demo 2"
        - cell "Parked"
      - row "TKT-1784268450109-229 Customer Demo 1 Parked":
        - cell "TKT-1784268450109-229"
        - cell
        - cell "Customer Demo 1"
        - cell "Parked"
```

# Test source

```ts
  180 |   // 5. Customer Login & Dashboard
  181 |   test('Scenario 5: Customer Login & Dashboard', async ({ page }) => {
  182 |     await page.goto('https://valet-parking-system-qtci.onrender.com/login');
  183 |     await page.fill('input[type="email"]', customers[0].email);
  184 |     await page.fill('input[type="password"]', 'password123');
  185 |     await page.click('button[type="submit"]');
  186 | 
  187 |     await page.waitForURL('**/customer');
  188 |     await expect(page.locator('text=Welcome to your customer portal.').first()).toBeVisible();
  189 |   });
  190 | 
  191 |   // 6. Valet checks in 10 Demo Vehicles
  192 |   test('Scenario 6: Valet checks in 10 Demo Vehicles', async ({ page }) => {
  193 |     test.setTimeout(60000); // 60 seconds timeout since it loops 10 times
  194 |     await page.goto('https://valet-parking-system-qtci.onrender.com/login');
  195 |     await page.fill('input[type="email"]', valets[0].email);
  196 |     await page.fill('input[type="password"]', 'password123');
  197 |     await page.click('button[type="submit"]');
  198 |     await page.waitForURL('**/valet');
  199 | 
  200 |     await page.click('text=Vehicle Check-in');
  201 |     await page.waitForURL('**/valet/check-in');
  202 | 
  203 |     for (let i = 0; i < vehicles.length; i++) {
  204 |       const v = vehicles[i];
  205 |       // Use existing customer mobile
  206 |       const customer = customers[i % customers.length];
  207 | 
  208 |       await page.locator('label:has-text("Mobile Number") + input').fill(customer.mobile);
  209 |       await page.locator('label:has-text("Customer Name") + input').fill(customer.name);
  210 |       await page.locator('label:has-text("Vehicle Number") + input').fill(v.num);
  211 |       await page.locator('select').first().selectOption(v.type);
  212 |       
  213 |       await page.click('button:has-text("Assign Slot & Check-In")');
  214 |       
  215 |       await page.waitForTimeout(1500); // Wait for check-in process
  216 |       
  217 |       if (i < vehicles.length - 1) {
  218 |         await page.click('button:has-text("Check-In Another Vehicle")');
  219 |         await page.waitForTimeout(500);
  220 |       }
  221 |     }
  222 |   });
  223 | 
  224 |   // 7. Valet checks out a vehicle and processes payment
  225 |   test('Scenario 7: Valet checks out a vehicle and processes payment', async ({ page }) => {
  226 |     await page.goto('https://valet-parking-system-qtci.onrender.com/login');
  227 |     await page.fill('input[type="email"]', valets[0].email);
  228 |     await page.fill('input[type="password"]', 'password123');
  229 |     await page.click('button[type="submit"]');
  230 |     await page.waitForURL('**/valet');
  231 | 
  232 |     await page.click('text=Vehicle Check-out');
  233 |     await page.waitForURL('**/valet/retrieve');
  234 | 
  235 |     // Search for first vehicle
  236 |     await page.fill('input[placeholder="Enter Ticket # or Vehicle #"]', vehicles[0].num);
  237 |     await page.click('button:has-text("Search Record")');
  238 |     
  239 |     // Wait for the action buttons
  240 |     await expect(page.locator('button:has-text("Mark as Retrieved & Calculate Fee")').first()).toBeVisible();
  241 |     await page.click('button:has-text("Mark as Retrieved & Calculate Fee")');
  242 | 
  243 |     // Process Payment
  244 |     await page.click('button:has-text("Confirm Payment")');
  245 |     await page.waitForTimeout(1500);
  246 |     
  247 |     // Success
  248 |     await expect(page.locator('text=Payment Completed').first()).toBeVisible();
  249 |   });
  250 | 
  251 |   // 8. Valet errors out on invalid ticket retrieval
  252 |   test('Scenario 8: Valet errors out on invalid ticket retrieval', async ({ page }) => {
  253 |     await page.goto('https://valet-parking-system-qtci.onrender.com/login');
  254 |     await page.fill('input[type="email"]', valets[1].email);
  255 |     await page.fill('input[type="password"]', 'password123');
  256 |     await page.click('button[type="submit"]');
  257 |     await page.waitForURL('**/valet');
  258 | 
  259 |     await page.click('text=Vehicle Check-out');
  260 |     await page.waitForURL('**/valet/retrieve');
  261 | 
  262 |     await page.fill('input[placeholder="Enter Ticket # or Vehicle #"]', 'NON-EXISTENT-V');
  263 |     await page.click('button:has-text("Search Record")');
  264 |     
  265 |     await expect(page.locator('text=No active parking record found.').first()).toBeVisible();
  266 |   });
  267 | 
  268 |   // 9. Admin verifies reports and database consistency
  269 |   test('Scenario 9: Admin verifies reports and database consistency', async ({ page }) => {
  270 |     await page.goto('https://valet-parking-system-qtci.onrender.com/login');
  271 |     await page.fill('input[type="email"]', 'admin_prod@e2e.test');
  272 |     await page.fill('input[type="password"]', 'password123');
  273 |     await page.click('button[type="submit"]');
  274 |     await page.waitForURL('**/admin');
  275 | 
  276 |     await page.click('text=Reports');
  277 |     await page.waitForURL('**/admin/reports');
  278 | 
  279 |     // Verify the charts are rendered
> 280 |     await expect(page.locator('canvas').first()).toBeVisible();
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  281 | 
  282 |     await page.click('text=Payments');
  283 |     await page.waitForURL('**/admin/payments');
  284 |     
  285 |     // Verify there is at least one completed payment (from scenario 7)
  286 |     await expect(page.locator('text=Completed').first()).toBeVisible();
  287 |   });
  288 | 
  289 |   // 10. Role-Based Access Control Enforcement
  290 |   test('Scenario 10: Role-Based Access Control Enforcement', async ({ page }) => {
  291 |     // Login as Customer
  292 |     await page.goto('https://valet-parking-system-qtci.onrender.com/login');
  293 |     await page.fill('input[type="email"]', customers[0].email);
  294 |     await page.fill('input[type="password"]', 'password123');
  295 |     await page.click('button[type="submit"]');
  296 |     await page.waitForURL('**/customer');
  297 | 
  298 |     // Attempt to access admin routes directly
  299 |     await page.goto('/admin');
  300 |     await expect(page).toHaveURL(/.*\/customer/);
  301 | 
  302 |     await page.goto('/valet');
  303 |     await expect(page).toHaveURL(/.*\/customer/);
  304 |   });
  305 | 
  306 | });
  307 | 
```