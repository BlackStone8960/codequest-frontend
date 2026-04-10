import { test, expect } from "@playwright/test";

test.describe("Auth flow", () => {
  test("unauthenticated access to /dashboard redirects to login", async ({
    browser,
  }) => {
    // Use a fresh context with no storageState (explicitly empty)
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    await page.goto("/dashboard");
    await page.waitForURL(/\/login/, { timeout: 10000 });

    await context.close();
  });

  test("login page is accessible", async ({ browser }) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Login", exact: true })).toBeVisible();

    await context.close();
  });
});
