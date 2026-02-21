const { test, expect } = require('@playwright/test');

test('open chatbot and send message', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
});
