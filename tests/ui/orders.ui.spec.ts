import { expect, test } from '@playwright/test';

test.describe('FuelPass UI defect proof', () => {
  test('FP-008: orders list should render newest order first', async ({ page }) => {
    await page.goto('/');

    const rows = page.getByTestId('order-row');
    await expect(rows.first()).toBeVisible();

    await expect(rows.first()).toContainText('#1');
  });

  test('FP-009: status column should expose text, not color alone', async ({ page }) => {
    await page.goto('/');

    const firstStatusCell = page.getByTestId('order-row').first().locator('td').nth(7);
    await expect(firstStatusCell).toContainText(
      /Submitted|Confirmed|Expiring|Expired|Rejected/,
    );
  });

  test('FP-010: order rows should be keyboard-operable actions', async ({ page }) => {
    await page.goto('/');

    const firstRow = page.getByTestId('order-row').first();
    await expect(firstRow).toBeVisible();

    await firstRow.focus();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/orders\/\d+$/);
  });

  test('FP-011: aircraft field should have a persistent visible label', async ({ page }) => {
    await page.goto('/orders/new');

    await expect(page.locator('label', { hasText: 'Aircraft tail number' })).toHaveCount(1);
  });

  test('FP-012: primary submit action should use FuelPass accent blue', async ({ page }) => {
    await page.goto('/orders/new');

    const background = await page.getByTestId('submit-order').evaluate((button) => {
      return getComputedStyle(button).backgroundColor;
    });

    expect(background).toBe('rgb(65, 104, 233)');
  });

  test('FP-013: orders list should format money values as currency', async ({ page }) => {
    await page.goto('/');

    const firstRow = page.getByTestId('order-row').first();
    await expect(firstRow).toBeVisible();

    await expect(firstRow.getByTestId('price-cell')).toContainText('$');
    await expect(firstRow.getByTestId('total-cell')).toContainText('$');
  });

  test('FP-014: detail load failures should show recoverable errors, not not-found', async ({
    page,
  }) => {
    await page.route('**/api/orders/2', (route) => route.abort());

    await page.goto('/orders/2');

    await expect(
      page.getByText(/couldn't load|connection|try again|refresh/i),
    ).toBeVisible();
    await expect(page.getByText('Order not found')).not.toBeVisible();
  });

  
});
