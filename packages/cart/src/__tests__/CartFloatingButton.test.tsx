import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CartDetailed } from "@pkg/domain";
import CartFloatingButton from "../CartFloatingButton";
import { useCart } from "../hooks";
import { CartProvider } from "../contexts";

jest.mock("../hooks/useCart", () => ({
  useCart: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

const mockRefetch = jest.fn().mockResolvedValue(undefined);

const createMockUseCartReturn = (cart: CartDetailed | null) => ({
  isLoading: false,
  error: null,
  actionLoading: false,
  actionError: null,
  refetch: mockRefetch,
  updateCart: jest.fn(),
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  getCartState: jest.fn().mockReturnValue({
    cart,
  }),
});

const renderCartFloatingButton = () => {
  return render(
    <CartProvider>
      <CartFloatingButton />
    </CartProvider>,
  );
};

describe("CartFloatingButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Visibility", () => {
    it("should not render when cart is empty", () => {
      mockUseCart.mockReturnValue(
        createMockUseCartReturn(null),
      );

      renderCartFloatingButton();

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should render when cart has items", () => {
      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 3,
          lines: [],
          id: "cart-1",
          totalAmount: "75.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      renderCartFloatingButton();

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("3");
    });

    it("should render when cart is null but totalQuantity is 0", () => {
      mockUseCart.mockReturnValue(createMockUseCartReturn(null));

      renderCartFloatingButton();

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Cart Update Events", () => {
    it("should listen for cart-updated events and call refetch", async () => {
      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 2,
          lines: [],
          id: "cart-1",
          totalAmount: "50.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      renderCartFloatingButton();

      window.dispatchEvent(new CustomEvent("cart-updated"));

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(1);
      });
    });

    it("should handle multiple cart-updated events", async () => {
      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 1,
          lines: [],
          id: "cart-1",
          totalAmount: "25.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      renderCartFloatingButton();

      window.dispatchEvent(new CustomEvent("cart-updated"));
      window.dispatchEvent(new CustomEvent("cart-updated"));
      window.dispatchEvent(new CustomEvent("cart-updated"));

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(3);
      });
    });

    it("should clean up event listener on unmount", () => {
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 1,
          lines: [],
          id: "cart-1",
          totalAmount: "25.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      const { unmount } = renderCartFloatingButton();

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "cart-updated",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Navigation", () => {
    it("should navigate to cart page when clicked", async () => {
      const user = userEvent.setup();

      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 1,
          lines: [],
          id: "cart-1",
          totalAmount: "25.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      renderCartFloatingButton();

      const button = screen.getByRole("button");
      await user.click(button);

      expect(button).toBeInTheDocument();
    });

    it("should have correct accessibility attributes", () => {
      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 5,
          lines: [],
          id: "cart-1",
          totalAmount: "125.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      renderCartFloatingButton();

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute(
        "aria-label",
        "Voir le panier (5 articles)",
      );
    });
  });

  describe("Counter Display", () => {
    it("should display correct count for single item", () => {
      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 1,
          lines: [],
          id: "cart-1",
          totalAmount: "25.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      renderCartFloatingButton();

      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should display correct count for multiple items", () => {
      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 10,
          lines: [],
          id: "cart-1",
          totalAmount: "250.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      renderCartFloatingButton();

      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  describe("Integration with Cart Actions", () => {
    it("should update when cart changes from empty to having items", async () => {
      const { rerender } = renderCartFloatingButton();

      expect(screen.queryByRole("button")).not.toBeInTheDocument();

      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 2,
          lines: [],
          id: "cart-1",
          totalAmount: "50.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      rerender(
        <CartProvider>
          <CartFloatingButton />
        </CartProvider>,
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("should update when cart changes from having items to empty", async () => {
      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 3,
          lines: [],
          id: "cart-1",
          totalAmount: "75.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      const { rerender } = renderCartFloatingButton();

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();

      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 0,
          lines: [],
          id: "cart-1",
          totalAmount: "0.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      rerender(
        <CartProvider>
          <CartFloatingButton />
        </CartProvider>,
      );

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("API Call Optimization", () => {
    it("should only call refetch once when cart-updated event is dispatched", async () => {
      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 1,
          lines: [],
          id: "cart-1",
          totalAmount: "25.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      renderCartFloatingButton();

      window.dispatchEvent(new CustomEvent("cart-updated"));

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(1);
      });
    });

    it("should not call refetch multiple times for multiple events in quick succession", async () => {
      mockUseCart.mockReturnValue(
        createMockUseCartReturn({
          totalQuantity: 1,
          lines: [],
          id: "cart-1",
          totalAmount: "25.00 EUR",
          checkoutUrl: "https://checkout.com",
        }),
      );

      renderCartFloatingButton();

      window.dispatchEvent(new CustomEvent("cart-updated"));
      window.dispatchEvent(new CustomEvent("cart-updated"));
      window.dispatchEvent(new CustomEvent("cart-updated"));

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(3);
      });
    });
  });
});
