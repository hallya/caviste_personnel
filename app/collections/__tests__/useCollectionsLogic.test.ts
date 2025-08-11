import { renderHook, act } from "@testing-library/react";
import { useCollectionsLogic } from "../hooks/useCollectionsLogic";
import { CollectionsTestData } from "../../__tests__/factories/collections-factory";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  usePathname: () => "/collections",
}));

// Mock useCollections hook
jest.mock("../../hooks/useCollections", () => ({
  useCollections: () => ({
    popupOpen: false,
    popupTitle: "",
    popupHandle: "",
    popupCollectionTags: [],
    popupProducts: [],
    popupLoading: false,
    hasNextPage: false,
    openCollection: jest.fn(),
    loadMore: jest.fn(),
    closePopup: jest.fn(),
  }),
}));

describe("useCollectionsLogic", () => {
  const defaultProps = {
    initialCollections: CollectionsTestData.manyCollections(15),
    searchParams: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useCollectionsLogic(defaultProps));

    expect(result.current.collections).toHaveLength(15);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.sortBy).toBe("name");
    expect(result.current.sortOrder).toBe("asc");
  });

  it("should initialize with search params", () => {
    const props = {
      ...defaultProps,
      searchParams: {
        search: "test",
        sort: "handle",
        order: "desc",
      },
    };

    const { result } = renderHook(() => useCollectionsLogic(props));

    expect(result.current.searchQuery).toBe("test");
    expect(result.current.sortBy).toBe("handle");
    expect(result.current.sortOrder).toBe("desc");
  });

  it("should filter collections by search query", () => {
    const { result } = renderHook(() => useCollectionsLogic(defaultProps));

    act(() => {
      result.current.onSearchChange("Collection 1");
    });

    expect(result.current.collections).toHaveLength(7);
    expect(result.current.collections[0].title).toBe("Collection 1");
  });

  it("should sort collections by name", () => {
    const { result } = renderHook(() => useCollectionsLogic(defaultProps));

    act(() => {
      result.current.onSortChange("name");
      result.current.onSortOrderChange("desc");
    });

    const firstCollection = result.current.collections[0];
    const lastCollection = result.current.collections[result.current.collections.length - 1];

    expect(firstCollection.title.localeCompare(lastCollection.title)).toBeGreaterThan(0);
  });

  it("should clear filters", () => {
    const props = {
      ...defaultProps,
      searchParams: {
        search: "test",
        sort: "handle",
        order: "desc",
      },
    };

    const { result } = renderHook(() => useCollectionsLogic(props));

    act(() => {
      result.current.onClearFilters();
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.sortBy).toBe("name");
    expect(result.current.sortOrder).toBe("asc");
    expect(result.current.collections).toHaveLength(15);
  });

  it("should handle item click", async () => {
    const { result } = renderHook(() => useCollectionsLogic(defaultProps));

    await act(async () => {
      await result.current.onItemClick("collection-1", "Collection 1", ["tag-0"]);
    });

    expect(result.current.onItemClick).toBeDefined();
  });
});
