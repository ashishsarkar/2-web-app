const { test, expect } = require('@playwright/test');

test('login and view my bookings', async ({ page }) => {
  await page.goto('/auth/login');
  await expect(page.getByRole('heading')).toBeVisible();
});
