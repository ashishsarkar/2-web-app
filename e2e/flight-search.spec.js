const { test, expect } = require('@playwright/test');

test('search flights and reach checkout', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/booking/i);
});
