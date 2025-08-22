import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Agent Chat/);
});

test('sends a message and gets a response', async ({ page }) => {
  // Set config in local storage to bypass the setup form
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('lg:chat:apiUrl', 'http://localhost:2024');
    localStorage.setItem('lg:chat:assistantId', 'agent');
  });
  await page.reload();

  // Wait for the main chat interface to be visible
  await expect(page.locator('textarea')).toBeVisible();

  // Type a message and send it
  await page.locator('textarea').fill('Hello, world!');
  await page.locator('button[type="submit"]').click();

  // Check that the human message appears
  await expect(page.locator('p:text("Hello, world!")')).toBeVisible();

  // Check that an assistant message appears
  // This will depend on the mock response from the server,
  // but we can check that a new message element is added.
  await expect(page.locator('.group.mr-auto')).toHaveCount(1);
});
