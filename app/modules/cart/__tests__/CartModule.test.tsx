import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { CartModule, useCartModule } from "../CartModule";
import { AppShell } from "../../../core/shell/AppShell";

const mockAddToCart = jest.fn(() => Promise.resolve({ cart: {} }));
const mockRemoveItem = jest.fn(() => Promise.resolve({}));
const mockRefetch = jest.fn(() => Promise.resolve());

jest.mock("../../../components/cart/hooks/useCart", () => ({
  useCart: () => ({
    cart: {
      lines: [
        {
          id: "line-1",
          variantId: "variant-1",
          quantity: 2,
          title: "Test Product",
          unitPrice: 29.99,
          image: "test-image.jpg",
        },
      ],
      totalAmount: "59.98",
      totalQuantity: 2,
    },
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
    addToCart: mockAddToCart,
    removeItem: mockRemoveItem,
    updateQuantity: jest.fn(() => Promise.resolve({})),
    refetch: mockRefetch,
  }),
}));

function TestComponent() {
  const cartModule = useCartModule();
  const cartState = cartModule.getCartState();

  const handleAddToCart = async () => {
    await cartModule.addToCart("product-1", "variant-1", 1);
  };

  const handleRemoveFromCart = async () => {
    await cartModule.removeFromCart("variant-1");
  };

  return (
    <div>
      <div data-testid="item-count">{cartState.itemCount}</div>
      <div data-testid="total">{cartState.total}</div>
      <div data-testid="loading">{cartState.isLoading.toString()}</div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handleRemoveFromCart}>Remove from Cart</button>
    </div>
  );
}

describe("CartModule", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides cart module context to children", () => {
    render(
      <AppShell>
        <CartModule>
          <TestComponent />
        </CartModule>
      </AppShell>
    );

    expect(screen.getByTestId("item-count")).toHaveTextContent("2");
    expect(screen.getByTestId("total")).toHaveTextContent("59.98");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("exposes addToCart functionality", async () => {
    render(
      <AppShell>
        <CartModule>
          <TestComponent />
        </CartModule>
      </AppShell>
    );

    const addButton = screen.getByRole("button", { name: "Add to Cart" });

    await user.click(addButton);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith("variant-1", 1);
    });
  });

  it("exposes removeFromCart functionality", async () => {
    render(
      <AppShell>
        <CartModule>
          <TestComponent />
        </CartModule>
      </AppShell>
    );

    const removeButton = screen.getByRole("button", {
      name: "Remove from Cart",
    });

    await user.click(removeButton);

    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith("line-1");
    });
  });

  it("throws error when useCartModule is used outside provider", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    function OutsideComponent() {
      useCartModule();
      return <div>Outside</div>;
    }

    expect(() => render(<OutsideComponent />)).toThrow(
      "useCartModule must be used within CartModule"
    );

    consoleSpy.mockRestore();
  });

  it("returns correct cart state", () => {
    function CartStateTest() {
      const cartModule = useCartModule();
      const state = cartModule.getCartState();

      return (
        <div>
          <div data-testid="items-length">{state.items.length}</div>
          <div data-testid="first-item-title">{state.items[0]?.title}</div>
          <div data-testid="first-item-price">{state.items[0]?.price}</div>
        </div>
      );
    }

    render(
      <AppShell>
        <CartModule>
          <CartStateTest />
        </CartModule>
      </AppShell>
    );

    expect(screen.getByTestId("items-length")).toHaveTextContent("1");
    expect(screen.getByTestId("first-item-title")).toHaveTextContent(
      "Test Product"
    );
    expect(screen.getByTestId("first-item-price")).toHaveTextContent("29.99");
  });

  it("handles module registration in AppShell", () => {
    render(
      <AppShell>
        <CartModule>
          <div data-testid="cart-registered">Cart Module Loaded</div>
        </CartModule>
      </AppShell>
    );

    expect(screen.getByTestId("cart-registered")).toBeInTheDocument();
  });
});
