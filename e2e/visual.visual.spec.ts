import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test("homepage should match visual baseline", async ({ page }) => {
    await page.goto("/");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Hide dynamic elements that change (timestamps, counters, etc.)
    await page.addStyleTag({
      content: `
        [data-testid="timestamp"],
        [data-testid="dynamic-counter"],
        .animate-pulse {
          visibility: hidden !important;
        }
      `,
    });

    // Take full page screenshot
    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("collections page should match visual baseline", async ({ page }) => {
    await page.goto("/collections");

    // Wait for collections to load
    await page.waitForSelector('[data-testid="collection-card"]', {
      timeout: 10000,
    });
    await page.waitForLoadState("networkidle");

    // Take screenshot
    await expect(page).toHaveScreenshot("collections.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("cart sidebar should match visual baseline", async ({ page }) => {
    await page.goto("/");

    // Open cart
    const cartButton = page.getByTestId("cart-button");
    if (await cartButton.isVisible()) {
      await cartButton.click();

      // Wait for sidebar animation
      await page.waitForTimeout(500);

      // Take screenshot of cart sidebar
      const cartSidebar = page.getByTestId("cart-sidebar");
      if (await cartSidebar.isVisible()) {
        await expect(cartSidebar).toHaveScreenshot("cart-sidebar.png");
      }
    }
  });

  test("responsive design on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Take mobile screenshot
    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("dark mode (if implemented)", async ({ page }) => {
    await page.goto("/");

    // Toggle dark mode if available
    const darkModeToggle = page.getByTestId("dark-mode-toggle");
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot("homepage-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    }
  });
});
