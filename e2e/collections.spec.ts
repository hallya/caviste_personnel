import { test, expect } from "@playwright/test";

test.describe("Collections Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/collections");
  });

  test("should display collections grid", async ({ page }) => {
    // Wait for collections to load
    await page.waitForSelector('[data-testid="collection-card"]', {
      timeout: 10000,
    });

    // Check collections are displayed
    const collections = page.getByTestId("collection-card");
    await expect(collections.first()).toBeVisible();

    // Check collection has image and title
    await expect(collections.first().getByRole("img")).toBeVisible();
    await expect(collections.first().getByRole("heading")).toBeVisible();
  });

  test("should navigate to specific collection", async ({ page }) => {
    // Wait for collections
    await page.waitForSelector('[data-testid="collection-card"]', {
      timeout: 10000,
    });

    // Click on first collection
    const firstCollection = page.getByTestId("collection-card").first();
    const collectionTitle = await firstCollection
      .getByRole("heading")
      .textContent();

    await firstCollection.click();

    // Check navigation worked
    await expect(page).toHaveURL(/\/collections\//);

    // Check we're on the right collection page
    if (collectionTitle) {
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        collectionTitle,
      );
    }
  });

  test("should handle empty collections state", async ({ page }) => {
    // Mock empty state or navigate to empty collection
    await page.route("**/api/collections**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ collections: [] }),
      });
    });

    await page.goto("/collections");

    // Check empty state message
    await expect(
      page.getByText(/aucune collection|no collections/i),
    ).toBeVisible();
  });

  test("should display collection metadata", async ({ page }) => {
    // Wait for collections
    await page.waitForSelector('[data-testid="collection-card"]', {
      timeout: 10000,
    });

    const collection = page.getByTestId("collection-card").first();

    // Check for description or product count
    const hasDescription = await collection
      .getByText(/produits?|products?/i)
      .isVisible();
    const hasCount = await collection.getByText(/\d+/).isVisible();

    expect(hasDescription || hasCount).toBeTruthy();
  });
});
