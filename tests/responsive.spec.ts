import { test, expect } from "@playwright/test";

const MOBILE_WIDTH = 375;

test.describe("Responsive layout — Mobile (375px)", () => {
  test.use({ viewport: { width: MOBILE_WIDTH, height: 667 } });

  const pagePaths = [
    "/dashboard",
    "/tasks",
    "/github-contributions",
    "/profile",
  ];

  for (const path of pagePaths) {
    test(`${path} renders without horizontal overflow`, async ({ page }) => {
      await page.goto(path);

      // scrollWidth should not exceed viewport width
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(overflow).toBe(false);
    });
  }

  test("dashboard cards stack vertically on mobile", async ({ page }) => {
    await page.goto("/dashboard");

    // The main grid should be grid-cols-1 on mobile
    const grid = page.locator(".grid-cols-1.md\\:grid-cols-2");
    await expect(grid).toBeVisible();

    // Level card and Streak section stack vertically (flex-col sm:flex-row)
    const firstRow = page.locator(".flex-col.sm\\:flex-row");
    await expect(firstRow).toBeVisible();
  });

  test("task list is usable on mobile", async ({ page }) => {
    await page.goto("/tasks");

    // Tasks heading is visible
    await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();

    // Add Task button is visible
    await expect(page.getByRole("button", { name: /Add Task/i })).toBeVisible();
  });

  test("Add Task modal opens on mobile", async ({ page }) => {
    await page.goto("/tasks");

    await page.getByRole("button", { name: /Add Task/i }).click();

    // Modal should appear
    const modal = page.locator('[role="dialog"], form').first();
    await expect(modal).toBeVisible();
  });

  test("mobile topbar navigation is accessible on all pages", async ({
    page,
  }) => {
    const paths = [
      "/dashboard",
      "/tasks",
      "/github-contributions",
      "/profile",
    ];

    for (const path of paths) {
      await page.goto(path);

      const topbar = page.locator(".md\\:hidden.fixed.top-0");
      await expect(topbar).toBeVisible();

      // Open sidebar to access nav links
      const menuButton = topbar.locator("button");
      await menuButton.click();

      const mobileSidebar = page.locator("aside.md\\:hidden.fixed.right-0");
      await expect(mobileSidebar).toHaveClass(/translate-x-0/);

      // Nav links are visible
      await expect(mobileSidebar.locator("nav")).toBeVisible();
    }
  });
});
