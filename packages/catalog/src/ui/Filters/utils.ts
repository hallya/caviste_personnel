import { URL_PARAMS } from "./constants";
import type { ProductFilters } from "./types";

export function parseFiltersFromUrl(): Partial<ProductFilters> {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const filters: Partial<ProductFilters> = {};

  const tagsParam = params.get(URL_PARAMS.TAGS);
  if (tagsParam) {
    filters.selectedTags = tagsParam.split(",").filter(Boolean);
  }

  const searchParam = params.get(URL_PARAMS.SEARCH);
  if (searchParam) {
    filters.searchQuery = searchParam;
  }

  const sortParam = params.get(URL_PARAMS.SORT);
  if (sortParam && ["name", "price"].includes(sortParam)) {
    filters.sortBy = sortParam as "name" | "price";
  }

  const orderParam = params.get(URL_PARAMS.ORDER);
  if (orderParam && ["asc", "desc"].includes(orderParam)) {
    filters.sortOrder = orderParam as "asc" | "desc";
  }

  return filters;
}

export function updateUrlWithFilters(filters: ProductFilters): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams();

  if (filters.selectedTags.length > 0) {
    params.set(URL_PARAMS.TAGS, filters.selectedTags.join(","));
  }

  if (filters.searchQuery?.trim()) {
    params.set(URL_PARAMS.SEARCH, filters.searchQuery.trim());
  }

  if (filters.sortBy && filters.sortBy !== "name") {
    params.set(URL_PARAMS.SORT, filters.sortBy);
  }

  if (filters.sortOrder && filters.sortOrder !== "asc") {
    params.set(URL_PARAMS.ORDER, filters.sortOrder);
  }

  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.replaceState({}, "", newUrl);
}

export function cleanUrl(): void {
  if (typeof window === "undefined") return;

  const newUrl = window.location.pathname;
  window.history.replaceState({}, "", newUrl);
}

export function productMatchesTags(
  product: { tags: string[] },
  selectedTags: string[],
): boolean {
  if (selectedTags.length === 0) return true;
  return selectedTags.every((tag) =>
    product.tags.some(
      (productTag) => productTag.toLowerCase() === tag.toLowerCase(),
    ),
  );
}

export function productMatchesSearch(
  product: { title: string; tags: string[] },
  searchQuery: string,
): boolean {
  if (!searchQuery.trim()) return true;

  const query = searchQuery.toLowerCase().trim();
  return (
    product.title.toLowerCase().includes(query) ||
    product.tags.some((tag) => tag.toLowerCase().includes(query))
  );
}

export function sortProducts<
  T extends { title: string; price?: string | null },
>(products: T[], sortBy: "name" | "price", sortOrder: "asc" | "desc"): T[] {
  return [...products].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name": {
        comparison = a.title.localeCompare(b.title);
        break;
      }
      case "price": {
        // Handle null/undefined prices - put them at the end
        if (!a.price && !b.price) comparison = 0;
        else if (!a.price) comparison = 1;
        else if (!b.price) comparison = -1;
        else {
          const priceA = parseFloat(a.price);
          const priceB = parseFloat(b.price);
          comparison = priceA - priceB;
        }
        break;
      }

      default: {
        comparison = a.title.localeCompare(b.title);
      }
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });
}
