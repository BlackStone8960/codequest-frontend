import { test, expect } from "@playwright/test";

const pages = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/tasks", name: "Tasks" },
  { path: "/github-contributions", name: "GitHub Activity" },
  { path: "/profile", name: "Profile" },
];

test.describe("Sidebar — Desktop", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  for (const { path, name } of pages) {
    test(`${name} page shows persistent left sidebar`, async ({ page }) => {
      await page.goto(path);

      const sidebar = page.locator("aside.hidden.md\\:flex");
      await expect(sidebar).toBeVisible();

      // Sidebar contains nav links
      await expect(sidebar.locator("nav")).toBeVisible();
    });
  }

  test("no top header exists on desktop", async ({ page }) => {
    await page.goto("/dashboard");

    // Mobile topbar should not be visible on desktop
    const mobileTopbar = page.locator(".md\\:hidden.fixed.top-0");
    await expect(mobileTopbar).toBeHidden();
  });
});

test.describe("Sidebar — Mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("mobile topbar is visible with hamburger icon", async ({ page }) => {
    await page.goto("/dashboard");

    const topbar = page.locator(".md\\:hidden.fixed.top-0");
    await expect(topbar).toBeVisible();

    // CODEQUEST logo in topbar
    await expect(topbar.getByText("CODEQUEST")).toBeVisible();

    // Hamburger button is visible
    const menuButton = topbar.locator("button");
    await expect(menuButton).toBeVisible();
  });

  test("tapping hamburger opens sidebar from the right", async ({ page }) => {
    await page.goto("/dashboard");

    const menuButton = page.locator(".md\\:hidden.fixed.top-0 button");
    const mobileSidebar = page.locator("aside.md\\:hidden.fixed.right-0");

    // Sidebar starts off-screen (translate-x-full)
    await expect(mobileSidebar).not.toHaveClass(/translate-x-0/);

    await menuButton.click();

    // Sidebar slides in (translate-x-0)
    await expect(mobileSidebar).toHaveClass(/translate-x-0/);
  });

  test("mobile sidebar does not show CODEQUEST logo (shown in topbar)", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    const menuButton = page.locator(".md\\:hidden.fixed.top-0 button");
    await menuButton.click();

    const mobileSidebar = page.locator("aside.md\\:hidden.fixed.right-0");
    await expect(mobileSidebar).not.toContainText("CODEQUEST");
  });

  test("tapping overlay closes sidebar", async ({ page }) => {
    await page.goto("/dashboard");

    const menuButton = page.locator(".md\\:hidden.fixed.top-0 button");
    await menuButton.click();

    const mobileSidebar = page.locator("aside.md\\:hidden.fixed.right-0");
    await expect(mobileSidebar).toHaveClass(/translate-x-0/);

    // Click overlay
    const overlay = page.locator(".md\\:hidden.fixed.inset-0.bg-black\\/50");
    await overlay.click();

    await expect(mobileSidebar).not.toHaveClass(/translate-x-0/);
  });

  for (const { path, name } of pages) {
    test(`${name} page uses sidebar layout on mobile`, async ({ page }) => {
      await page.goto(path);

      // Desktop sidebar is hidden on mobile
      const desktopSidebar = page.locator("aside.hidden.md\\:flex");
      await expect(desktopSidebar).toBeHidden();

      // Mobile topbar is visible
      const topbar = page.locator(".md\\:hidden.fixed.top-0");
      await expect(topbar).toBeVisible();
    });
  }
});
