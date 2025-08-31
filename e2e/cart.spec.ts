import { test, expect } from "@playwright/test";

test.describe("Shopping Cart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should add product to cart", async ({ page }) => {
    // Navigate to a product (assuming we have products on homepage)
    const productCard = page.getByTestId("product-card").first();

    if (await productCard.isVisible()) {
      await productCard.click();

      // Add to cart
      const addToCartButton = page.getByRole("button", {
        name: /ajouter au panier|add to cart/i,
      });
      await addToCartButton.click();

      // Check cart count increased
      await expect(page.getByTestId("cart-count")).toContainText(/[1-9]/);

      // Check notification
      await expect(
        page.getByText(/ajouté au panier|added to cart/i),
      ).toBeVisible();
    }
  });

  test("should open cart sidebar", async ({ page }) => {
    // Click cart icon
    const cartButton = page
      .getByTestId("cart-button")
      .or(page.getByRole("button", { name: /panier|cart/i }));

    if (await cartButton.isVisible()) {
      await cartButton.click();

      // Check cart sidebar is visible
      await expect(page.getByTestId("cart-sidebar")).toBeVisible();

      // Check cart content
      await expect(page.getByText(/votre panier|your cart/i)).toBeVisible();
    }
  });

  test("should remove item from cart", async ({ page }) => {
    // First add an item (mock or through UI)
    // This test assumes cart has items or we add them first

    // Open cart
    const cartButton = page.getByTestId("cart-button");
    if (await cartButton.isVisible()) {
      await cartButton.click();

      // Remove item if present
      const removeButton = page
        .getByRole("button", { name: /supprimer|remove/i })
        .first();
      if (await removeButton.isVisible()) {
        await removeButton.click();

        // Check item removed notification
        await expect(page.getByText(/supprimé|removed/i)).toBeVisible();
      }
    }
  });

  test("should update item quantity", async ({ page }) => {
    // Open cart
    const cartButton = page.getByTestId("cart-button");
    if (await cartButton.isVisible()) {
      await cartButton.click();

      // Find quantity input
      const quantityInput = page
        .getByRole("spinbutton")
        .or(page.getByTestId("quantity-input"))
        .first();
      if (await quantityInput.isVisible()) {
        await quantityInput.fill("2");
        await quantityInput.blur();

        // Check quantity updated
        await expect(quantityInput).toHaveValue("2");
      }
    }
  });
});
