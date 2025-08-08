import { useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_FILTERS } from '../constants';
import { parseFiltersFromUrl, updateUrlWithFilters, cleanUrl, productMatchesTags, productMatchesSearch, sortProducts } from '../utils';
import type { ProductFilters, UseProductFiltersReturn } from '../types';
import type { SimplifiedProduct } from '../../../types/shopify';

export function useProductFilters(
  products: SimplifiedProduct[],
  initialFilters?: Partial<ProductFilters>,
  excludeTags?: string[]
): UseProductFiltersReturn {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    Array.isArray(initialFilters?.selectedTags) ? initialFilters.selectedTags : DEFAULT_FILTERS.selectedTags
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters?.searchQuery || DEFAULT_FILTERS.searchQuery);
  const [sortBy, setSortBy] = useState<ProductFilters['sortBy']>(initialFilters?.sortBy || DEFAULT_FILTERS.sortBy);
  const [sortOrder, setSortOrder] = useState<ProductFilters['sortOrder']>(initialFilters?.sortOrder || DEFAULT_FILTERS.sortOrder);

  useEffect(() => {
    if (!initialFilters) {
      const urlFilters = parseFiltersFromUrl();
      if (Array.isArray(urlFilters.selectedTags)) setSelectedTags(urlFilters.selectedTags);
      if (urlFilters.searchQuery) setSearchQuery(urlFilters.searchQuery);
      if (urlFilters.sortBy) setSortBy(urlFilters.sortBy);
      if (urlFilters.sortOrder) setSortOrder(urlFilters.sortOrder);
    }
  }, [initialFilters]);

  const availableTags = useMemo(() => {
    const allTags = products.flatMap(product => product.tags);
    const uniqueTags = [...new Set(allTags)];
    
    const filteredTags = excludeTags 
      ? uniqueTags.filter(tag => !excludeTags.some(excludeTag => 
          tag.toLowerCase() === excludeTag.toLowerCase()
        ))
      : uniqueTags;
    
    return filteredTags.sort();
  }, [products, excludeTags]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => productMatchesTags(product, selectedTags));
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(product => productMatchesSearch(product, searchQuery));
    }

    return filtered;
  }, [products, selectedTags, searchQuery]);

  const getFilteredAndSortedProducts = useCallback(() => {
    return sortProducts(filteredProducts, sortBy || 'name', sortOrder || 'asc');
  }, [filteredProducts, sortBy, sortOrder]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTags(DEFAULT_FILTERS.selectedTags);
    setSearchQuery(DEFAULT_FILTERS.searchQuery);
    setSortBy(DEFAULT_FILTERS.sortBy);
    setSortOrder(DEFAULT_FILTERS.sortOrder);
    cleanUrl();
  }, []);

  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim().length > 0;

  useEffect(() => {
    const filters: ProductFilters = { selectedTags, searchQuery, sortBy, sortOrder };
    updateUrlWithFilters(filters);
  }, [selectedTags, searchQuery, sortBy, sortOrder]);

  return {
    filters: { selectedTags, searchQuery, sortBy, sortOrder },
    availableTags,
    filteredProducts: getFilteredAndSortedProducts(),
    setSelectedTags,
    toggleTag,
    clearFilters,
    hasActiveFilters,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    getFilteredAndSortedProducts,
  };
} 