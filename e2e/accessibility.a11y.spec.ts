import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests", () => {
  test("homepage should be accessible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude(".third-party-widget") // Exclude third-party widgets
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("collections page should be accessible", async ({ page }) => {
    await page.goto("/collections");
    await page.waitForSelector('[data-testid="collection-card"]', {
      timeout: 10000,
    });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("keyboard navigation should work", async ({ page }) => {
    await page.goto("/");

    // Tab through focusable elements
    await page.keyboard.press("Tab");

    // Check that first focusable element is focused
    const firstFocusable = page.locator(":focus").first();
    await expect(firstFocusable).toBeVisible();

    // Continue tabbing and check focus indicators
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      await expect(focused).toBeVisible();
    }
  });

  test("images should have alt text", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check all images have alt attributes
    const images = page.getByRole("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      expect(alt).toBeDefined();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test("form inputs should have labels", async ({ page }) => {
    await page.goto("/");

    // Find all form inputs
    const inputs = page.locator("input, textarea, select");
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const type = await input.getAttribute("type");

      // Skip hidden inputs
      if (type === "hidden") continue;

      // Check for label, aria-label, or aria-labelledby
      const hasLabel = await input
        .locator("..")
        .getByText(/label/i)
        .isVisible();
      const ariaLabel = await input.getAttribute("aria-label");
      const ariaLabelledBy = await input.getAttribute("aria-labelledby");

      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test("color contrast should be sufficient", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .include("body")
      .analyze();

    // Filter for color contrast violations
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === "color-contrast",
    );

    expect(colorContrastViolations).toEqual([]);
  });

  test("headings should be properly structured", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check heading hierarchy
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const count = await headings.count();

    if (count > 0) {
      // Should have one h1
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);

      // Check heading order (simplified check)
      const firstHeading = await headings.first().tagName();
      expect(firstHeading.toLowerCase()).toBe("h1");
    }
  });

  test("cart should be accessible with screen reader", async ({ page }) => {
    await page.goto("/");

    // Open cart
    const cartButton = page.getByTestId("cart-button");
    if (await cartButton.isVisible()) {
      // Check cart button has accessible name
      const accessibleName = await cartButton.getAttribute("aria-label");
      expect(accessibleName || (await cartButton.textContent())).toBeTruthy();

      await cartButton.click();

      // Check cart sidebar accessibility
      const cartSidebar = page.getByTestId("cart-sidebar");
      if (await cartSidebar.isVisible()) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('[data-testid="cart-sidebar"]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    }
  });
});
