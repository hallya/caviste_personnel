import { renderHook, act } from "@testing-library/react";
import { useCollections } from "../useCollections";
import { __testHelpers__, ProductCollectionSortKeys } from "@pkg/services-shopify";
import { CollectionProducts } from "@pkg/domain";

const { collectionsFactory, productFactory } = __testHelpers__;

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

const mockCollections = collectionsFactory();

describe("useCollections - API Call Optimization", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ collections: mockCollections }),
    } as Response);
  });

  it("should not make duplicate API calls on mount", async () => {
    renderHook(() => useCollections());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const collectionsApiCalls = mockFetch.mock.calls.filter((call) =>
      call[0]?.toString().includes("/api/collections")
    );

    expect(collectionsApiCalls).toHaveLength(1);
    expect(collectionsApiCalls[0][0]).toContain("/api/collections");
  });

  it("should not make duplicate API calls when hook re-renders", async () => {
    const { rerender } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    mockFetch.mockClear();

    rerender();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const collectionsApiCalls = mockFetch.mock.calls.filter((call) =>
      call[0]?.toString().includes("/api/collections")
    );

    expect(collectionsApiCalls).toHaveLength(0);
  });

  it("should load collections data correctly", async () => {
    const { result } = renderHook(() => useCollections());

    expect(result.current.collectionsLoading).toBe(true);
    expect(result.current.collections).toEqual([]);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.collectionsLoading).toBe(false);
    expect(result.current.collections).toEqual(mockCollections);
    expect(result.current.collectionsError).toBeNull();
  });

  it("should handle API errors correctly", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.collectionsLoading).toBe(false);
    expect(result.current.collections).toEqual([]);
    expect(result.current.collectionsError).toBe("Network error");
  });

  it("should handle HTTP errors correctly", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal Server Error" }),
    } as Response);

    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.collectionsLoading).toBe(false);
    expect(result.current.collections).toEqual([]);
    expect(result.current.collectionsError).toBe("Erreur HTTP: 500");
  });

  it("should handle empty collections response", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ collections: null }),
    } as Response);

    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.collectionsLoading).toBe(false);
    expect(result.current.collections).toEqual([]);
    expect(result.current.collectionsError).toBeNull();
  });
});

describe("useCollections - Popup Management", () => {
  const mockCollectionProducts: CollectionProducts = {
    id: "collection-1",
    title: "Test Collection",
    products: [
      productFactory({
        overrideProduct: {
          title: "Product 1",
          featuredImageUrl: "https://example.com/product1.jpg",
          price: "25.99",
          variantId: "variant-1",
          availableForSale: true,
          totalInventory: 10,
          tags: ["rouge", "bordeaux"],
        },
      }),
      productFactory({
        overrideProduct: {
          title: "Product 2",
          featuredImageUrl: "https://example.com/product2.jpg",
          price: "30.99",
          variantId: "variant-2",
          availableForSale: true,
          totalInventory: 5,
          tags: ["blanc", "bourgogne"],
        },
      }),
    ],
    pageInfo: {
      hasNextPage: true,
      endCursor: "cursor123",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockFetch.mockImplementation((url) => {
      if (url?.toString().includes("/api/collections")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ collections: mockCollections }),
        } as Response);
      }

      if (url?.toString().includes("/api/collection-products")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockCollectionProducts,
        } as Response);
      }

      return Promise.reject(new Error("Unknown URL"));
    });
  });

  it("should open collection popup successfully", async () => {
    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.popupOpen).toBe(false);

    await act(async () => {
      await result.current.openCollection(
        "test-collection",
        "Test Collection",
        ["tag1", "tag2"],
        ProductCollectionSortKeys.CollectionDefault
      );
    });

    expect(result.current.popupOpen).toBe(true);
    expect(result.current.popupTitle).toBe("Test Collection");
    expect(result.current.popupHandle).toBe("test-collection");
    expect(result.current.popupCollectionTags).toEqual(["tag1", "tag2"]);
    expect(result.current.popupProducts).toEqual(
      mockCollectionProducts.products
    );
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.popupLoading).toBe(false);
  });

  it("should handle openCollection with default collection tags", async () => {
    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.openCollection("test-collection", "Test Collection", null, ProductCollectionSortKeys.CollectionDefault);
    });

    expect(result.current.popupCollectionTags).toEqual([]);
  });

  it("should close popup correctly", async () => {
    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.openCollection("test-collection", "Test Collection", null, ProductCollectionSortKeys.CollectionDefault);
    });

    expect(result.current.popupOpen).toBe(true);

    act(() => {
      result.current.closePopup();
    });

    expect(result.current.popupOpen).toBe(false);
  });

  it("should load more products when hasNextPage is true", async () => {
    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.openCollection("test-collection", "Test Collection", null, ProductCollectionSortKeys.CollectionDefault);
    });

    const initialProductsCount = result.current.popupProducts.length;

    const additionalProducts = {
      title: "Test Collection",
      products: [
        {
          id: "product-3",
          title: "Product 3",
          image: "https://example.com/product3.jpg",
          price: "35.99",
          currency: "EUR",
          variantId: "variant-3",
          availableForSale: true,
          quantityAvailable: 3,
          tags: ["rouge", "premium"],
        },
      ],
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    };

    mockFetch.mockImplementation((url) => {
      if (url?.toString().includes("/api/collections")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ collections: mockCollections }),
        } as Response);
      }

      if (url?.toString().includes("/api/collection-products")) {
        if (url?.toString().includes("after=cursor123")) {
          return Promise.resolve({
            ok: true,
            json: async () => additionalProducts,
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          json: async () => mockCollectionProducts,
        } as Response);
      }

      return Promise.reject(new Error("Unknown URL"));
    });

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.popupProducts).toHaveLength(initialProductsCount + 1);
    expect(result.current.popupProducts[initialProductsCount].variantId).toBe(
      "variant-3"
    );
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.popupLoading).toBe(false);
  });

  it("should not load more when no nextCursor available", async () => {
    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const noNextCursorResponse = {
      ...mockCollectionProducts,
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    };

    mockFetch.mockImplementation((url) => {
      if (url?.toString().includes("/api/collections")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ collections: mockCollections }),
        } as Response);
      }

      if (url?.toString().includes("/api/collection-products")) {
        return Promise.resolve({
          ok: true,
          json: async () => noNextCursorResponse,
        } as Response);
      }

      return Promise.reject(new Error("Unknown URL"));
    });

    await act(async () => {
      await result.current.openCollection("test-collection", "Test Collection", null, ProductCollectionSortKeys.CollectionDefault);
    });

    const initialProductsCount = result.current.popupProducts.length;

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.popupProducts).toHaveLength(initialProductsCount);
  });

  it("should not load more when no popupHandle is set", async () => {
    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const initialProductsCount = result.current.popupProducts.length;

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.popupProducts).toHaveLength(initialProductsCount);
  });
});
