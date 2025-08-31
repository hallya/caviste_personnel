import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    await page.goto("/");

    // Check that the page loads
    await expect(page).toHaveTitle(/Caviste/);

    // Check for main navigation
    await expect(page.getByRole("navigation")).toBeVisible();

    // Check for main content
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("should display featured collections", async ({ page }) => {
    await page.goto("/");

    // Wait for collections to load
    await page.waitForSelector('[data-testid="collection-card"]', {
      timeout: 10000,
    });

    // Check that collections are displayed
    const collections = page.getByTestId("collection-card");
    await expect(collections.first()).toBeVisible();
  });

  test("should navigate to collections page", async ({ page }) => {
    await page.goto("/");

    // Click on collections link
    await page.getByRole("link", { name: /collections/i }).click();

    // Check URL
    await expect(page).toHaveURL(/\/collections/);

    // Check page content
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("should handle search functionality", async ({ page }) => {
    await page.goto("/");

    // Find search input
    const searchInput = page
      .getByRole("searchbox")
      .or(page.getByPlaceholder(/search/i));

    if (await searchInput.isVisible()) {
      await searchInput.fill("wine");
      await searchInput.press("Enter");

      // Wait for search results
      await page.waitForURL(/search/);
      await expect(
        page.getByText(/résultats/i).or(page.getByText(/results/i)),
      ).toBeVisible();
    }
  });
});
