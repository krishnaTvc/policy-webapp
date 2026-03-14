import { test, expect } from '@playwright/test'

// Generate unique email for each run to avoid duplicates
const uniqueEmail = () => `testuser_${Date.now()}@playwright.com`

test.describe('Authentication flows', () => {
  test('Sign-up flow: new user can register and lands on dashboard', async ({ page }) => {
    const email = uniqueEmail()

    await page.goto('/signup')
    await expect(page).toHaveTitle(/PolicyVault/)

    // Fill in the signup form
    await page.fill('#email', email)
    await page.fill('#password', 'TestPass123')
    await page.fill('#confirm', 'TestPass123')

    // Submit
    await page.click('#signup-submit-btn')

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('My Policies')
  })

  test('Login flow: seeded user can log in and sees dashboard', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveTitle(/PolicyVault/)

    await page.fill('#email', 'alice@example.com')
    await page.fill('#password', 'password123')
    await page.click('#login-submit-btn')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('My Policies')
  })

  test('Login with wrong credentials shows error', async ({ page }) => {
    await page.goto('/login')
    await page.fill('#email', 'wrong@example.com')
    await page.fill('#password', 'wrongpassword')
    await page.click('#login-submit-btn')

    // Should stay on login and show error
    await expect(page).toHaveURL('/login')
    await expect(page.locator('.alert-error')).toBeVisible()
  })

  test('Unauthenticated access to /dashboard redirects to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })
})
