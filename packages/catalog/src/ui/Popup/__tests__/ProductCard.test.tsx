import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "@pkg/cart";
import { NotificationProvider } from "@pkg/notifications";
import ProductCard from "../ProductCard";
import type { Product } from "@pkg/domain";

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

const baseProduct: Product = {
  title: "Test Wine",
  featuredImageUrl: "https://example.com/wine.jpg",
  price: "25.00 EUR",
  availableForSale: true,
  totalInventory: 10,
  variantId: "variant-1",
  tags: ["test-tag"],
};

const renderProductCard = (product: Product) => {
  return render(
    <NotificationProvider>
      <CartProvider>
        <ProductCard product={product} />
      </CartProvider>
    </NotificationProvider>,
  );
};

describe("ProductCard", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "cart-1",
        totalQuantity: 0,
        totalAmount: "0.00 EUR",
        checkoutUrl: "checkout",
        lines: [],
      }),
    } as Response);
  });

  describe("Stock Display", () => {
    it("should show stock message on hover when stock is available", async () => {
      renderProductCard(baseProduct);

      const article = screen.getByRole("article");

      await user.hover(article);

      await waitFor(() => {
        expect(
          screen.getByText("10 bouteilles disponibles"),
        ).toBeInTheDocument();
      });
    });

    it("should show 'Stock épuisé' message on hover when stock is zero", async () => {
      const outOfStockProduct: Product = { ...baseProduct, totalInventory: 0 };
      renderProductCard(outOfStockProduct);

      const article = screen.getByRole("article");

      await user.hover(article);

      await waitFor(() => {
        expect(screen.getByText("Stock épuisé")).toBeInTheDocument();
      });
    });

    it("should show correct singular form for 1 bottle", async () => {
      const singleBottleProduct: Product = { ...baseProduct, totalInventory: 1 };
      renderProductCard(singleBottleProduct);

      const article = screen.getByRole("article");

      await user.hover(article);

      await waitFor(() => {
        expect(screen.getByText("1 bouteille disponible")).toBeInTheDocument();
      });
    });

    it("should have stock message with correct CSS classes for hover effect", async () => {
      renderProductCard(baseProduct);

      const stockMessage = screen.getByText("10 bouteilles disponibles");

      expect(stockMessage).toHaveClass("opacity-0");
      expect(stockMessage).toHaveClass("group-hover:opacity-100");
      expect(stockMessage).toHaveClass("transition-opacity");
      expect(stockMessage).toHaveClass("duration-200");
    });
  });

  describe("Basic Rendering", () => {
    it("should render product title", async () => {
      renderProductCard(baseProduct);

      await waitFor(() => {
        expect(screen.getByText("Test Wine")).toBeInTheDocument();
      });
    });

    it("should render product price", async () => {
      renderProductCard(baseProduct);

      await waitFor(() => {
        expect(screen.getByText("25.00 EUR")).toBeInTheDocument();
      });
    });

    it("should render bottle and carton buttons", async () => {
      renderProductCard(baseProduct);

      await waitFor(() => {
        expect(
          screen.getByLabelText(/Ajouter 1 bouteille de Test Wine au panier/),
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText(
            /Ajouter 1 carton \(6 bouteilles\) de Test Wine au panier/,
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Button State Management", () => {
    it("should enable buttons when stock is sufficient", async () => {
      renderProductCard(baseProduct);

      await waitFor(() => {
        const bottleButton = screen.getByLabelText(
          /Ajouter 1 bouteille de Test Wine au panier/,
        );
        const cartonButton = screen.getByLabelText(
          /Ajouter 1 carton \(6 bouteilles\) de Test Wine au panier/,
        );

        expect(bottleButton).not.toBeDisabled();
        expect(cartonButton).not.toBeDisabled();
      });
    });

    it("should disable carton button when stock is less than 6", async () => {
      const productWithLowStock: Product = { ...baseProduct, totalInventory: 5 };
      renderProductCard(productWithLowStock);

      await waitFor(() => {
        const bottleButton = screen.getByLabelText(
          /Ajouter 1 bouteille de Test Wine au panier/,
        );
        const cartonButton = screen.getByLabelText(
          /Carton de Test Wine non disponible/,
        );

        expect(bottleButton).not.toBeDisabled();
        expect(cartonButton).toBeDisabled();
      });
    });

    it("should disable all buttons when stock is exhausted", async () => {
      const outOfStockProduct: Product = { ...baseProduct, totalInventory: 0 };
      renderProductCard(outOfStockProduct);

      await waitFor(() => {
        const bottleButton = screen.getByLabelText(
          /Bouteille de Test Wine non disponible/,
        );
        const cartonButton = screen.getByLabelText(
          /Carton de Test Wine non disponible/,
        );

        expect(bottleButton).toBeDisabled();
        expect(cartonButton).toBeDisabled();
      });
    });
  });

  describe("Add to Cart Functionality", () => {
    it("should add bottle to cart when bottle button is clicked", async () => {
      renderProductCard(baseProduct);

      const bottleButton = screen.getByLabelText(
        /Ajouter 1 bouteille de Test Wine au panier/,
      );

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cartId: "cart-1",
          totalQuantity: 1,
          checkoutUrl: "checkout",
        }),
      } as Response);

      await user.click(bottleButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartId: null,
            variantId: "variant-1",
            quantity: 1,
          }),
        });
      });
    });

    it("should add carton to cart when carton button is clicked", async () => {
      renderProductCard(baseProduct);

      const cartonButton = screen.getByLabelText(
        /Ajouter 1 carton \(6 bouteilles\) de Test Wine au panier/,
      );

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cartId: "cart-1",
          totalQuantity: 6,
          checkoutUrl: "checkout",
        }),
      } as Response);

      await user.click(cartonButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartId: null,
            variantId: "variant-1",
            quantity: 6,
          }),
        });
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle product without image", async () => {
      const noImageProduct: Product = { ...baseProduct, featuredImageUrl: null };
      renderProductCard(noImageProduct);

      await waitFor(() => {
        expect(screen.getByText("Test Wine")).toBeInTheDocument();
      });
    });

    it("should handle product without price", async () => {
      const noPriceProduct: Product = { ...baseProduct, price: "N/A" };
      renderProductCard(noPriceProduct);

      await waitFor(() => {
        expect(screen.getByText("Test Wine")).toBeInTheDocument();
      });
    });
  });
});
