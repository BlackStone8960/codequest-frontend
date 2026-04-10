import { test, expect } from "@playwright/test";
import { format, addDays } from "date-fns";

const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

// serial ensures create runs before complete within each project
test.describe.serial("Task CRUD", () => {
  // Unique title per project run to avoid cross-project conflicts
  const taskTitle = `Playwright test task ${Date.now()}`;

  test("can create a new task", async ({ page }) => {
    await page.goto("/tasks");

    await page.getByRole("button", { name: /Add Task/i }).click();

    await page.getByLabel("Title").fill(taskTitle);
    await page.getByLabel("Due Date").fill(tomorrow);
    await page.getByLabel("Difficulty").selectOption("easy");

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/tasks") &&
          res.request().method() === "POST" &&
          res.status() === 201
      ),
      page.getByRole("button", { name: "Add", exact: true }).click(),
    ]);

    expect(response.status()).toBe(201);
    await expect(page.getByText(taskTitle)).toBeVisible();
  });

  test("can complete a task", async ({ page }) => {
    await page.goto("/tasks");

    const taskCard = page
      .locator('[class*="rounded-lg"]')
      .filter({ hasText: taskTitle });

    const checkbox = taskCard.locator('input[type="checkbox"]');

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/tasks") &&
          res.url().includes("/complete") &&
          res.status() === 200
      ),
      checkbox.click(),
    ]);

    expect(response.status()).toBe(200);

    // Task moves to completed section with strikethrough
    await expect(page.getByText(taskTitle)).toBeVisible();
  });
});
