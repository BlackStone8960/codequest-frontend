import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "TEST_EMAIL and TEST_PASSWORD must be set in .env.test or environment variables"
    );
  }

  await page.goto("/login");

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // Wait for the API response instead of using arbitrary timeout
  const [response] = await Promise.all([
    page.waitForResponse((res) =>
      res.url().includes("/api/auth/login") && res.status() === 200
    ),
    page.click('button[type="submit"]'),
  ]);

  expect(response.status()).toBe(200);

  // Verify redirect to dashboard
  await expect(page).toHaveURL("/dashboard");

  // Save storageState (includes localStorage with JWT token and cookies)
  await page.context().storageState({ path: authFile });
});
