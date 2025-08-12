import { renderHook, act } from "@testing-library/react";
import { useProductFilters } from "../hooks/useProductFilters";
import type { SimplifiedProduct } from "../../../types/shopify";
import { ANALYTICS_EVENTS } from "../../analytics/constants/analytics";
import { FILTER_TYPES, FILTER_ACTIONS } from "../constants";

const mockTrack = jest.fn();
jest.mock("../../analytics/hooks/useAnalytics", () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}));

jest.mock("../utils", () => {
  const actual = jest.requireActual("../utils");
  return {
    ...actual,
    parseFiltersFromUrl: jest.fn(() => ({})),
    updateUrlWithFilters: jest.fn(),
    cleanUrl: jest.fn(),
  };
});

const mockProducts: SimplifiedProduct[] = [
  {
    id: "1",
    title: "Vin Rouge",
    tags: ["vin-rouge", "pour-repas", "vin-leger"],
    price: "15.00",
    image: null,
    currency: "EUR",
    availableForSale: true,
  },
  {
    id: "2",
    title: "Vin Blanc",
    tags: ["vin-blanc", "pour-apero", "vin-leger"],
    price: "12.00",
    image: null,
    currency: "EUR",
    availableForSale: true,
  },
  {
    id: "3",
    title: "Champagne",
    tags: ["champagne", "pour-apero", "moment-a-deux"],
    price: "45.00",
    image: null,
    currency: "EUR",
    availableForSale: true,
  },
];

describe("useProductFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTrack.mockClear();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    expect(result.current.filters.selectedTags).toEqual([]);
    expect(result.current.filters.searchQuery).toBe("");
    expect(result.current.filters.sortBy).toBe("name");
    expect(result.current.filters.sortOrder).toBe("asc");
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("should filter products by tags with AND logic", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.toggleTag("vin-leger");
      result.current.toggleTag("pour-apero");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].title).toBe("Vin Blanc");
  });

  it("should filter products by search query", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.setSearchQuery("rouge");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].title).toBe("Vin Rouge");
  });

  it("should clear filters and clean URL", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.toggleTag("vin-leger");
      result.current.setSearchQuery("test");
    });

    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.selectedTags).toEqual([]);
    expect(result.current.filters.searchQuery).toBe("");
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("should exclude specified tags", () => {
    const { result } = renderHook(() =>
      useProductFilters(mockProducts, undefined, ["vin-rouge"])
    );

    expect(result.current.availableTags).not.toContain("vin-rouge");
    expect(result.current.availableTags).toContain("vin-blanc");
  });

  it("should sort products by name", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.setSortBy("name");
      result.current.setSortOrder("asc");
    });

    const products = result.current.filteredProducts;
    expect(products[0].title).toBe("Champagne");
    expect(products[1].title).toBe("Vin Blanc");
    expect(products[2].title).toBe("Vin Rouge");
  });

  it("should sort products by price", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.setSortBy("price");
      result.current.setSortOrder("asc");
    });

    const products = result.current.filteredProducts;
    expect(products[0].price).toBe("12.00");
    expect(products[1].price).toBe("15.00");
    expect(products[2].price).toBe("45.00");
  });

  it("should sort products in descending order", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.setSortBy("price");
      result.current.setSortOrder("desc");
    });

    const products = result.current.filteredProducts;
    expect(products[0].price).toBe("45.00");
    expect(products[1].price).toBe("15.00");
    expect(products[2].price).toBe("12.00");
  });

  it("should reset filters to default values", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.toggleTag("vin-leger");
      result.current.setSearchQuery("test");
      result.current.setSortBy("price");
      result.current.setSortOrder("desc");
    });

    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.selectedTags).toEqual([]);
    expect(result.current.filters.searchQuery).toBe("");
    expect(result.current.filters.sortBy).toBe("name");
    expect(result.current.filters.sortOrder).toBe("asc");
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("should return correct filters object", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.toggleTag("vin-leger");
      result.current.setSearchQuery("rouge");
      result.current.setSortBy("price");
      result.current.setSortOrder("desc");
    });

    expect(result.current.filters).toEqual({
      selectedTags: ["vin-leger"],
      searchQuery: "rouge",
      sortBy: "price",
      sortOrder: "desc",
    });
  });

  describe("Analytics tracking", () => {
    it("tracks FILTER_APPLIED event when adding tag", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.toggleTag("vin-leger");
      });

      expect(mockTrack).toHaveBeenCalledWith({
        name: ANALYTICS_EVENTS.FILTER_APPLIED,
        properties: {
          filter_type: FILTER_TYPES.TAG,
          tag: "vin-leger",
          action: FILTER_ACTIONS.ADD,
          total_tags: 1,
        },
      });
    });

    it("tracks FILTER_APPLIED event when removing tag", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.toggleTag("vin-leger");
        result.current.toggleTag("vin-leger");
      });

      expect(mockTrack).toHaveBeenCalledWith({
        name: ANALYTICS_EVENTS.FILTER_APPLIED,
        properties: {
          filter_type: FILTER_TYPES.TAG,
          tag: "vin-leger",
          action: FILTER_ACTIONS.REMOVE,
          total_tags: 0,
        },
      });
    });

    it("tracks FILTER_CLEARED event when clearing filters", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.toggleTag("vin-leger");
        result.current.setSearchQuery("test");
      });

      mockTrack.mockClear();

      act(() => {
        result.current.clearFilters();
      });

      expect(mockTrack).toHaveBeenCalledWith({
        name: ANALYTICS_EVENTS.FILTER_CLEARED,
        properties: {
          previous_tags_count: 1,
          previous_search_query: "test",
        },
      });
    });

    it("tracks SEARCH_PERFORMED event when searching", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setSearchQuery("rouge");
      });

      expect(mockTrack).toHaveBeenCalledWith({
        name: ANALYTICS_EVENTS.SEARCH_PERFORMED,
        properties: {
          query: "rouge",
          results_count: 3,
        },
      });
    });

    it("does not track SEARCH_PERFORMED for empty queries", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setSearchQuery("");
      });

      expect(mockTrack).not.toHaveBeenCalledWith({
        name: ANALYTICS_EVENTS.SEARCH_PERFORMED,
        properties: expect.any(Object),
      });
    });
  });
});
