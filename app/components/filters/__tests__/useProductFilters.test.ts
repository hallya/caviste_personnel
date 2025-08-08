import { renderHook, act } from "@testing-library/react";
import { useProductFilters } from "../hooks/useProductFilters";
import type { SimplifiedProduct } from "../../../types/shopify";

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
});
