import { useState, useEffect, useCallback, useMemo } from "react";
import { useAnalytics, ANALYTICS_EVENTS } from "@pkg/analytics";
import { DEFAULT_FILTERS } from "../constants";
import {
  parseFiltersFromUrl,
  updateUrlWithFilters,
  cleanUrl,
  productMatchesTags,
  productMatchesSearch,
} from "../utils";
import type { ProductFilters, UseProductFiltersReturn } from "../types";
import { FILTER_TYPES, FILTER_ACTIONS } from "../constants";
import { Product } from "@pkg/domain";

export function useProductFilters(
  products: Product[],
  initialFilters?: Partial<ProductFilters>,
  excludeTags?: string[],
): UseProductFiltersReturn {
  const { track } = useAnalytics();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    Array.isArray(initialFilters?.selectedTags)
      ? initialFilters.selectedTags
      : DEFAULT_FILTERS.selectedTags,
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    initialFilters?.searchQuery || DEFAULT_FILTERS.searchQuery,
  );
  const [sortBy, setSortBy] = useState<ProductFilters["sortBy"]>(
    initialFilters?.sortBy || DEFAULT_FILTERS.sortBy,
  );
  const [sortOrder, setSortOrder] = useState<ProductFilters["sortOrder"]>(
    initialFilters?.sortOrder || DEFAULT_FILTERS.sortOrder,
  );

  useEffect(() => {
    if (!initialFilters) {
      const urlFilters = parseFiltersFromUrl();
      if (Array.isArray(urlFilters.selectedTags))
        setSelectedTags(urlFilters.selectedTags);
      if (urlFilters.searchQuery) setSearchQuery(urlFilters.searchQuery);
      if (urlFilters.sortBy) setSortBy(urlFilters.sortBy);
      if (urlFilters.sortOrder) setSortOrder(urlFilters.sortOrder);
    }
  }, [initialFilters]);

  const availableTags = useMemo(() => {
    const allTags = products.flatMap((product) => product.tags);
    const uniqueTags = [...new Set(allTags)];

    const filteredTags = excludeTags
      ? uniqueTags.filter(
          (tag) =>
            !excludeTags.some(
              (excludeTag) => tag.toLowerCase() === excludeTag.toLowerCase(),
            ),
        )
      : uniqueTags;

    return filteredTags.sort();
  }, [products, excludeTags]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedTags.length > 0) {
      filtered = filtered.filter((product) =>
        productMatchesTags(product, selectedTags),
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        productMatchesSearch(product, searchQuery),
      );
    }

    return filtered;
  }, [products, selectedTags, searchQuery]);

  const toggleTag = useCallback(
    (tag: string) => {
      setSelectedTags((prev) => {
        const newTags = prev.includes(tag)
          ? prev.filter((t) => t !== tag)
          : [...prev, tag];

        track({
          name: ANALYTICS_EVENTS.FILTER_APPLIED,
          properties: {
            filter_type: FILTER_TYPES.TAG,
            tag,
            action: prev.includes(tag)
              ? FILTER_ACTIONS.REMOVE
              : FILTER_ACTIONS.ADD,
            total_tags: newTags.length,
          },
        });

        return newTags;
      });
    },
    [track],
  );

  const clearFilters = useCallback(() => {
    setSelectedTags(DEFAULT_FILTERS.selectedTags);
    setSearchQuery(DEFAULT_FILTERS.searchQuery);
    setSortBy(DEFAULT_FILTERS.sortBy);
    setSortOrder(DEFAULT_FILTERS.sortOrder);
    cleanUrl();

    track({
      name: ANALYTICS_EVENTS.FILTER_CLEARED,
      properties: {
        previous_tags_count: selectedTags.length,
        previous_search_query: searchQuery,
      },
    });
  }, [track, selectedTags.length, searchQuery]);

  const hasActiveFilters =
    selectedTags.length > 0 || searchQuery.trim().length > 0;

  const handleSearchQueryChange = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (query.trim()) {
        track({
          name: ANALYTICS_EVENTS.SEARCH_PERFORMED,
          properties: {
            query: query.trim(),
            results_count: filteredProducts.length,
          },
        });
      }
    },
    [track, filteredProducts.length],
  );

  useEffect(() => {
    const filters: ProductFilters = {
      selectedTags,
      searchQuery,
      sortBy,
      sortOrder,
    };
    updateUrlWithFilters(filters);
  }, [selectedTags, searchQuery, sortBy, sortOrder]);

  return {
    filters: { selectedTags, searchQuery, sortBy, sortOrder },
    availableTags,
    filteredProducts,
    setSelectedTags,
    toggleTag,
    clearFilters,
    hasActiveFilters,
    setSearchQuery: handleSearchQueryChange,
    setSortBy,
    setSortOrder,
  };
}
