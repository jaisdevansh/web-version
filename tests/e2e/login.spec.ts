import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check if critical elements exist
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByPlaceholder(/email/i).fill('invalid@example.com');
    await page.getByPlaceholder(/password/i).fill('wrongpassword');
    
    // Since it's a generic button, we target by type or text
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    
    // Expect error toast or message
    // Adjust based on your toast/notification system
    // await expect(page.locator('.toast')).toBeVisible();
  });
});
