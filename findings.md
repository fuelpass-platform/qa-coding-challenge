# FuelPass QA Findings

## Environment

- OS: macOS 26.5.1 (25F80)
- Node.js: v24.15.0
- npm: 11.12.1
- Test runner: Playwright 1.61.0
- Browser used for UI evidence: Chrome for Testing 149.0.7827.55, Playwright Chromium v1228

## Installation

Run these commands from the repository root:

```bash
npm install
npx playwright install chromium
```

For manual exploration only, start the app with `npm run dev`. The frontend runs at `http://localhost:5173` and the backend API runs at `http://localhost:3001/api`.

Do not leave `npm run dev` running while executing the Playwright commands below. The Playwright config starts fresh backend and frontend servers automatically on the same ports, so existing processes on `3001` or `5173` can cause startup conflicts.

## Test Commands

The automated tests assert the expected correct FuelPass behavior. Failures against the challenge build are the evidence for the matching finding IDs. A non-zero exit code is expected because the tests prove planted defects; a setup problem would look like a Playwright `webServer` timeout or browser-install error.

Recommended review order:

```bash
# 1. API defect evidence
npm run test:api

# 2. UI defect evidence
npm run test:ui

# 3. Full combined run, optional if the two suites above were already reviewed
npm run test:e2e
```

Observed verification on 2026-06-23:

- `npm run test:api` executed 8 tests; all 8 failed as expected for FP-001 through FP-007 and FP-016.
- `npm run test:ui` executed 7 tests; all 7 failed as expected for FP-008 through FP-014.
- `npm run test:e2e` executed all 15 automated tests; all 15 failed as expected for FP-001 through FP-014 and FP-016.
- `npm run build` passed for backend and frontend after adding QA infrastructure.
- Date timezone check for FP-015:

```bash
TZ=America/New_York node -e 'const d=new Date("2026-06-18"); console.log(`${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`)'
# observed: 17/06/2026
```

## Testing Strategy

I prioritized defects that undermine marketplace trust: wrong order identity, wrong totals, invalid fuel bookings, misleading status filters, inaccessible core flows, and design-system violations around numbers, status, forms, and primary actions.

Automation uses a single Playwright setup because it can cover direct API requests and browser behavior without changing application logic. The tests run serially because the backend store is in memory and mutating tests affect later state.

Manual/source-backed checks were used where a short command was stronger than full UI automation, such as timezone-sensitive date-only parsing.

## Findings

### FP-001: Order detail API returns the wrong order

Severity: High

Justification: A fuel marketplace cannot be trusted if `/orders/:id` displays a different order than the requested ID.

Category: API / Functional

Steps to reproduce:

1. Start the app with a fresh backend.
2. Run `curl -sS http://localhost:3001/api/orders/1`.
3. Inspect the returned `id`.

Expected:

`GET /api/orders/1` returns the order with `id: 1`.

Actual:

The response returns `id: 2`. The service treats the route ID as a zero-based array index.

Evidence:

- Automated test: `tests/api/orders.api.spec.ts`
- Test name: `FP-001: order detail lookup should return the requested id`
- Observed failure: expected `1`, received `2`

Likely root cause:

`packages/backend/src/orders/orders.service.ts` uses `this.orders[id]` instead of finding by `order.id`.

Suggested fix:

Find by stable ID, e.g. `this.orders.find((order) => order.id === id)`, and return 404 only when no matching ID exists.

### FP-002: Submitted status filter includes Confirmed orders

Severity: High

Justification: Status filters drive operational decisions; mixing submitted and confirmed orders makes the list unreliable.

Category: API / Functional

Steps to reproduce:

1. Run `curl -sS 'http://localhost:3001/api/orders?status=Submitted'`.
2. Inspect each returned `status`.

Expected:

Filtering by `Submitted` returns only submitted orders.

Actual:

The response also includes `Confirmed` orders.

Evidence:

- Automated test: `tests/api/orders.api.spec.ts`
- Test name: `FP-002: Submitted filter should only return Submitted orders`
- Observed failure: `orders.every((order) => order.status === 'Submitted')` was false

Likely root cause:

`orders.service.ts` intentionally includes `Confirmed` when `status === 'Submitted'`.

Suggested fix:

Filter by exact status unless the product explicitly introduces a separate grouped "active" filter.

### FP-003: Stored totals truncate cents instead of rounding

Severity: High

Justification: Incorrect financial totals directly damage trust in pricing.

Category: Business Logic

Steps to reproduce:

1. Run `curl -sS http://localhost:3001/api/orders`.
2. Find order `id: 1`.
3. Calculate `333 * 6.275`.

Expected:

`333 * 6.275 = 2089.575`, rounded to cents as `2089.58`.

Actual:

The API stores `2089.57`.

Evidence:

- Automated test: `tests/api/orders.api.spec.ts`
- Test name: `FP-003: stored totals should round to the nearest cent`
- Observed failure: expected `2089.58`, received `2089.57`

Likely root cause:

`orders.service.ts` uses `Math.floor(raw * 100) / 100`.

Suggested fix:

Round to nearest cent with `Math.round(raw * 100) / 100`, or use a decimal/money-safe representation.

### FP-004: New orders start as Confirmed instead of Submitted

Severity: High

Justification: A buyer clicking "Submit order" should not instantly create a confirmed supplier state.

Category: Functional / Business Logic

Steps to reproduce:

1. Run a valid `POST /api/orders` request.
2. Inspect the returned `status`.

Expected:

A newly submitted buyer order starts as `Submitted`.

Actual:

The API returns `status: "Confirmed"`.

Evidence:

- Automated test: `tests/api/orders.api.spec.ts`
- Test name: `FP-004: a submitted order should start in Submitted state`
- Observed failure: expected `"Submitted"`, received `"Confirmed"`

Likely root cause:

`orders.service.ts` hard-codes created order status to `Confirmed`.

Suggested fix:

Create new buyer submissions as `Submitted`, then transition to `Confirmed` only after confirmation.

### FP-005: API accepts negative fuel volumes

Severity: High

Justification: Negative fuel orders create invalid operational records and negative totals.

Category: Validation / API

Steps to reproduce:

1. Run `POST /api/orders` with `volumeGallons: -10`.
2. Inspect the response status.

Expected:

The API rejects negative volume with a 400 validation error.

Actual:

The API returns `201 Created`.

Evidence:

- Automated test: `tests/api/orders.api.spec.ts`
- Test name: `FP-005: API should reject negative fuel volume`
- Observed failure: expected `400`, received `201`

Likely root cause:

`CreateOrderDto` only uses `@IsNumber()` and has no positive/minimum validation.

Suggested fix:

Add positive finite-number validation and align UI constraints with backend validation.

### FP-006: API allows orders without an aircraft tail number

Severity: High

Justification: Fuel orders must identify a specific aircraft; blank aircraft values break order accountability.

Category: Validation / API

Steps to reproduce:

1. Run `POST /api/orders` without `aircraft`.
2. Inspect the response status.

Expected:

The API rejects the request with a 400 validation error.

Actual:

The API returns `201 Created` and stores an empty aircraft string.

Evidence:

- Automated test: `tests/api/orders.api.spec.ts`
- Test name: `FP-006: API should require aircraft tail number`
- Observed failure: expected `400`, received `201`

Likely root cause:

`CreateOrderDto` marks `aircraft` as optional.

Suggested fix:

Require a non-empty aircraft/tail number and reject blank or whitespace-only values.

### FP-007: API accepts unsupported airport codes

Severity: Medium

Justification: The backend accepts records the UI cannot select, creating API/UI contract drift.

Category: Validation / API

Steps to reproduce:

1. Run `POST /api/orders` with `airport: "ZZZZ"`.
2. Inspect the response status.

Expected:

The API rejects unsupported airport codes.

Actual:

The API returns `201 Created`.

Evidence:

- Automated test: `tests/api/orders.api.spec.ts`
- Test name: `FP-007: API should reject unsupported airport codes`
- Observed failure: expected `400`, received `201`

Likely root cause:

`CreateOrderDto` only validates airport as a string and does not enforce supported ICAO values.

Suggested fix:

Validate against the supported airport list or a documented ICAO/business-rule validator.

### FP-008: Orders list is not newest first

Severity: Medium

Justification: Recency is important in an operations list; older orders can appear before newer ones.

Category: Functional

Steps to reproduce:

1. Open `http://localhost:5173/`.
2. Inspect the first order row after loading.

Expected:

The newest seeded order, `#1` with `created: 2026-06-15`, appears first.

Actual:

Order `#4` appears first.

Evidence:

- Automated test: `tests/ui/orders.ui.spec.ts`
- Test name: `FP-008: orders list should render newest order first`
- Observed failure: expected row to contain `#1`, received row text beginning `#4`

Likely root cause:

`OrdersListPage.tsx` sorts formatted `DD/MM/YYYY` strings instead of raw timestamps.

Suggested fix:

Sort by `Date.parse(created)` or ISO string comparison before formatting for display.

### FP-009: Orders list communicates status by color only

Severity: High

Justification: Users and assistive technology cannot reliably understand order status from an unlabeled colored dot.

Category: Accessibility / Design

Steps to reproduce:

1. Open the order list.
2. Inspect the `STATUS` column.

Expected:

Each status cell includes visible text or an accessible status label such as `Submitted`.

Actual:

The cell contains only a colored dot and no status text.

Evidence:

- Automated test: `tests/ui/orders.ui.spec.ts`
- Test name: `FP-009: status column should expose text, not color alone`
- Observed failure: expected status text, received an empty status cell string

Likely root cause:

`OrdersListPage.tsx` renders only a styled span using `STATUS_DOT`.

Suggested fix:

Use a semantic status chip with text and an accessible name.

### FP-010: Order rows are not keyboard-operable actions

Severity: High

Justification: Keyboard users cannot open order details from the primary list workflow.

Category: Accessibility / Functional

Steps to reproduce:

1. Open the order list.
2. Try to focus an order row and press Enter.

Expected:

Rows expose a keyboard-operable link/action and navigate to detail.

Actual:

Enter does not navigate; the URL remains `/`.

Evidence:

- Automated test: `tests/ui/orders.ui.spec.ts`
- Test name: `FP-010: order rows should be keyboard-operable actions`
- Observed failure: expected `/orders/:id`, received `/`

Likely root cause:

`OrdersListPage.tsx` attaches `onClick` to `TableRow` without a link, button, row action, or keyboard handler.

Suggested fix:

Use proper row actions or include a link/button with keyboard support and visible focus.

### FP-011: Aircraft field has no persistent visible label

Severity: Medium

Justification: Placeholder-only labels are weaker for form usability and accessibility, especially after typing.

Category: Accessibility / Design

Steps to reproduce:

1. Open `/orders/new`.
2. Inspect the aircraft input.

Expected:

The aircraft field has a persistent visible label.

Actual:

The field only has placeholder text.

Evidence:

- Automated test: `tests/ui/orders.ui.spec.ts`
- Test name: `FP-011: aircraft field should have a persistent visible label`
- Observed failure: expected one label with `Aircraft tail number`, received zero

Likely root cause:

`CreateOrderPage.tsx` sets only `placeholder="Aircraft tail number"` on the HeroUI `Input`.

Suggested fix:

Add a real `label="Aircraft tail number"` and field-specific validation messaging.

### FP-012: Primary submit button uses brand navy instead of accent blue

Severity: Medium

Justification: The primary action violates the documented interaction color contract.

Category: Design

Steps to reproduce:

1. Open `/orders/new`.
2. Inspect the submit button computed background color.

Expected:

Primary actions use accent blue `#4168E9`.

Actual:

The button uses brand navy `#002366`.

Evidence:

- Automated test: `tests/ui/orders.ui.spec.ts`
- Test name: `FP-012: primary submit action should use FuelPass accent blue`
- Observed failure: expected `rgb(65, 104, 233)`, received `rgb(0, 35, 102)`

Likely root cause:

`CreateOrderPage.tsx` uses `className="bg-fuelpass-500"`.

Suggested fix:

Use HeroUI `color="primary"` or the documented accent-primary token for primary actions.

### FP-013: Orders list shows raw money values

Severity: Medium

Justification: Raw price and total values reduce trust and conflict with the precision rules for a financial marketplace.

Category: Design / Functional

Steps to reproduce:

1. Open the order list.
2. Inspect `PRICE/GAL` and `TOTAL` cells.

Expected:

Money values are formatted as currency with cents.

Actual:

The list renders raw values such as `6.275` and `3269.27` without currency.

Evidence:

- Automated test: `tests/ui/orders.ui.spec.ts`
- Test name: `FP-013: orders list should format money values as currency`
- Observed failure: expected `$`, received `6.275`

Likely root cause:

`OrdersListPage.tsx` renders `o.pricePerGallon` and `o.total` directly instead of using `formatCurrency`.

Suggested fix:

Format price and totals consistently and right-align numeric table columns.

### FP-014: Detail load failures are shown as Order not found

Severity: Medium

Justification: Network failures and missing records require different recovery paths; conflating them misleads users.

Category: UX / Error Handling

Steps to reproduce:

1. Block or abort `GET /api/orders/2`.
2. Open `/orders/2`.

Expected:

The page shows a recoverable load error with retry/refresh guidance.

Actual:

The page shows `Order not found`.

Evidence:

- Automated test: `tests/ui/orders.ui.spec.ts`
- Test name: `FP-014: detail load failures should show recoverable errors, not not-found`
- Observed failure: no recoverable error text was visible

Likely root cause:

`OrderDetailPage.tsx` catches every request failure and sets `notFound` without distinguishing 404 from network/server errors.

Suggested fix:

Classify fetch errors and render a separate recoverable load-error state.

### FP-015: Date-only values shift in negative UTC timezones

Severity: Medium

Justification: Requested delivery dates must be exact operational dates; timezone drift can show the wrong day.

Category: Functional / Date Handling

Steps to reproduce:

1. Run:

```bash
TZ=America/New_York node -e 'const d=new Date("2026-06-18"); console.log(`${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`)'
```

Expected:

The date-only value `2026-06-18` displays as `18/06/2026`.

Actual:

The command prints `17/06/2026`.

Evidence:

- Manual command above
- Source: `packages/frontend/src/lib/format.ts` parses date-only strings with `new Date(iso)` and local getters

Likely root cause:

Date-only strings are parsed as UTC midnight and then read in local time.

Suggested fix:

Format date-only strings without timezone conversion, or parse `YYYY-MM-DD` into local date parts explicitly.

### FP-016: Created order cannot be opened by ID

Severity: Medium

Justification: The API allows creating a new order, but the created order cannot be opened from the UI or fetched correctly afterward. This creates a broken user flow after successful order creation.

Category: API / Routing / Data Consistency

Steps to reproduce:

1. Run `POST /api/orders` with a valid request body.
2. Copy the `id` from the API response.
3. Try to open the created order in the UI using `/orders/{id}`.
4. Or run `GET /api/orders/{id}` using the created order ID.

Expected:

The newly created order should be accessible by its ID.

Actual:

The order is created successfully, but opening or fetching it by ID returns page not found / not found response.

Evidence:

* Automated test: `tests/api/orders.api.spec.ts`
* Test name: `FP-008: API should allow fetching newly created order by ID`
* Observed failure: created order returns `201 Created`, but `GET /api/orders/{id}` does not return the created order.

Likely root cause:

The backend may be using the order ID as an array index instead of searching by the order `id` field. Because array indexes start from `0`, the created order ID may not match the correct array position.

Suggested fix:

Update the order lookup logic to search by `order.id` instead of using the ID directly as an array index. Add regression coverage for creating an order and then fetching the same order by ID.


## Additional Risks

- Created-order UI redirect is likely affected by FP-001: a newly created `id: 9` routes to `/orders/9`, but backend lookup by array index can return 404.
- Form validation is mostly generic; invalid field states are not field-specific.
- API tests mutate the in-memory backend; all evidence assumes a fresh Playwright-launched server.
- `npm install` reported existing dependency audit issues. I did not treat them as findings because dependency auditing is outside the challenge's fuel-order scope.

## Areas Not Tested

- Broad cross-browser and mobile matrix.
- Screen-reader walkthrough with VoiceOver/NVDA.
- Performance, security, dependency audit, auth, persistence, deployment, and CI.
- Pixel-perfect full-page visual review beyond material design-system deviations.

## Final Summary

- Total findings: 16
- Critical: 0
- High: 8
- Medium: 8
- Low: 0

Findings by category:

- API / validation / business logic: 8
- Frontend functional / UX: 4
- Accessibility: 3
- Design-system compliance: 3
- Date handling: 1

Files added:

- `findings.md`
- `playwright.config.ts`
- `tests/README.md`
- `tests/api/orders.api.spec.ts`
- `tests/ui/orders.ui.spec.ts`

Files changed for QA infrastructure:

- `package.json`
- `package-lock.json`

Release recommendation: **NO GO**

The build should not go to pilot customers until the order identity, status filtering, total calculation, create-order validation, keyboard access, and status communication defects are fixed and regression-tested.
