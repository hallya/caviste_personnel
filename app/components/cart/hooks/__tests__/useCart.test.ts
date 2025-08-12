import { renderHook, waitFor, act } from "@testing-library/react";
import { useCart } from "../useCart";
import type { Cart } from "../../types";
import { ANALYTICS_EVENTS } from "../../../analytics/constants/analytics";
import { CART_ACTIONS } from "../../constants";

const mockTrack = jest.fn();
jest.mock("../../../analytics/hooks/useAnalytics", () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}));

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const mockCart: Cart = {
  id: "gid://shopify/Cart/123",
  totalQuantity: 2,
  totalAmount: "300.00 EUR",
  checkoutUrl: "https://checkout.shopify.com/123",
  lines: [
    {
      id: "gid://shopify/CartLine/1",
      title: "Château Margaux 2018",
      price: "150.00 EUR",
      unitPrice: 150.0,
      currency: "EUR",
      lineTotal: "300.00 EUR",
      quantity: 2,
      image: "https://example.com/wine.jpg",
      availableForSale: true,
      quantityAvailable: 10,
      variantId: "gid://shopify/ProductVariant/456",
    },
  ],
};

describe("useCart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue("cart-123");
    mockTrack.mockClear();
  });

  it("fetches cart data on mount", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    } as Response);

    const { result } = renderHook(() => useCart());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cart).toEqual(mockCart);
    expect(result.current.error).toBeNull();
  });

  it("handles cart not found", async () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cart).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("handles fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cart).toBeNull();
    expect(result.current.error).toBe("Erreur de connexion");
  });

  it("handles non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cart).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("refetches cart data when refetch is called", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    } as Response);

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updatedCart = { ...mockCart, totalQuantity: 3 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedCart,
    } as Response);

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.cart).toEqual(updatedCart);
    });
  });

  it("updates cart when updateCart is called", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    } as Response);

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updatedCart = { ...mockCart, totalQuantity: 5 };
    act(() => {
      result.current.updateCart(updatedCart);
    });

    expect(result.current.cart).toEqual(updatedCart);
  });

  it("calls fetch with correct URL and parameters", async () => {
    localStorageMock.getItem.mockReturnValue("cart-123");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    } as Response);

    renderHook(() => useCart());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });

  describe("Analytics tracking", () => {
    it("tracks CART_ADD event when adding item successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const { result } = renderHook(() => useCart());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cartId: "new-cart-123", ...mockCart }),
      } as Response);

      await act(async () => {
        await result.current.addToCart("variant-123", 2);
      });

      expect(mockTrack).toHaveBeenCalledWith({
        name: ANALYTICS_EVENTS.CART_ADD,
        properties: {
          variant_id: "variant-123",
          quantity: 2,
          cart_id: "new-cart-123",
        },
      });
    });

    it("tracks CART_ERROR event when adding item fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const { result } = renderHook(() => useCart());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await act(async () => {
        await result.current.addToCart("variant-123", 2);
      });

      expect(mockTrack).toHaveBeenCalledWith({
        name: ANALYTICS_EVENTS.CART_ERROR,
        properties: {
          action: CART_ACTIONS.ADD_TO_CART,
          error_message: "Network error",
          variant_id: "variant-123",
          quantity: 2,
        },
      });
    });

    it("tracks CART_UPDATE_QUANTITY event when updating quantity successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const { result } = renderHook(() => useCart());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      await act(async () => {
        await result.current.updateQuantity("line-123", 3);
      });

      expect(mockTrack).toHaveBeenCalledWith({
        name: ANALYTICS_EVENTS.CART_UPDATE_QUANTITY,
        properties: {
          line_id: "line-123",
          quantity: 3,
          cart_id: "cart-123",
        },
      });
    });

    it("tracks CART_ERROR event when updating quantity fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const { result } = renderHook(() => useCart());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await act(async () => {
        await result.current.updateQuantity("line-123", 3);
      });

      expect(mockTrack).toHaveBeenCalledWith({
        name: ANALYTICS_EVENTS.CART_ERROR,
        properties: {
          action: CART_ACTIONS.UPDATE_QUANTITY,
          error_message: "Network error",
          line_id: "line-123",
          quantity: 3,
        },
      });
    });

    it("tracks CART_REMOVE event when removing item successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const { result } = renderHook(() => useCart());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      await act(async () => {
        await result.current.removeItem("line-123");
      });

      expect(mockTrack).toHaveBeenCalledWith({
        name: ANALYTICS_EVENTS.CART_REMOVE,
        properties: {
          line_id: "line-123",
          cart_id: "cart-123",
        },
      });
    });

    it("tracks CART_ERROR event when removing item fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const { result } = renderHook(() => useCart());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await act(async () => {
        await result.current.removeItem("line-123");
      });

      expect(mockTrack).toHaveBeenCalledWith({
        name: ANALYTICS_EVENTS.CART_ERROR,
        properties: {
          action: CART_ACTIONS.REMOVE_ITEM,
          error_message: "Network error",
          line_id: "line-123",
        },
      });
    });
  });
});
