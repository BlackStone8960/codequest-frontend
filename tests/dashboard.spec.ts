import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("shows XP and level after login", async ({ page }) => {
    await page.goto("/dashboard");

    // Level section is visible
    await expect(page.getByText("Level")).toBeVisible();

    // XP display (currentLevelXP / levelUpXP)
    await expect(page.getByText(/\d+ \/ \d+ XP/)).toBeVisible();

    // HP display
    await expect(page.getByText(/HP:/)).toBeVisible();
  });

  test("shows Statistics section", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByText("Statistics")).toBeVisible();
    await expect(page.getByText(/Total XP:/)).toBeVisible();
    await expect(page.getByText(/Tasks Completed:/)).toBeVisible();
  });
});
