import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { useProductFilters } from './useProductFilters';
import { API_LIMITS, COLLECTION_CACHE_CONFIG } from '../constants';
import type { UseCollectionFiltersProps, UseCollectionFiltersReturn } from '../types';

interface CacheEntry {
  tags: string[];
  timestamp: number;
}

const tagsCache = new Map<string, CacheEntry>();

export function useCollectionFilters({
  products,
  collectionTitle,
  collectionHandle,
  collectionTags = [],
}: UseCollectionFiltersProps): UseCollectionFiltersReturn {
  const [allCollectionTags, setAllCollectionTags] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsError, setTagsError] = useState<string | null>(null);
  const lastCollectionHandle = useRef<string>('');

  const {
    availableTags: productTags,
    filteredProducts,
    toggleTag,
    clearFilters,
    hasActiveFilters,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    filters,
  } = useProductFilters(products, undefined, [collectionTitle, collectionHandle]);

  const loadCollectionTags = useCallback(async (handle: string) => {
    if (!handle) return;
    
    if (tagsCache.has(handle)) {
      const entry = tagsCache.get(handle)!;
      const isExpired = Date.now() - entry.timestamp > COLLECTION_CACHE_CONFIG.TTL_MS;
      
      if (!isExpired) {
        setAllCollectionTags(entry.tags);
        return;
      } else {
        tagsCache.delete(handle);
      }
    }
    
    setTagsLoading(true);
    setTagsError(null);
    try {
      const res = await fetch(`/api/collection-products?handle=${handle}&first=${API_LIMITS.MAX_PRODUCTS_PER_COLLECTION}`);
      if (res.ok) {
        const data = await res.json();
        const products = data.products || [];
        
        const allTags = products.flatMap((product: { tags: string[] }) => product.tags || []);
        const uniqueTags = [...new Set(allTags)]
          .filter((tag): tag is string => typeof tag === 'string')
          .sort();
        
        setAllCollectionTags(uniqueTags);
        
        if (tagsCache.size >= COLLECTION_CACHE_CONFIG.MAX_SIZE) {
          const firstKey = tagsCache.keys().next().value;
          if (firstKey) {
            tagsCache.delete(firstKey);
          }
        }
        tagsCache.set(handle, { tags: uniqueTags, timestamp: Date.now() });
      } else {
        setTagsError(`Failed to load collection tags: ${res.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTagsError(`Error loading tags: ${errorMessage}`);
      console.error('Error loading tags:', error);
    } finally {
      setTagsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (collectionHandle && collectionHandle !== lastCollectionHandle.current) {
      lastCollectionHandle.current = collectionHandle;
      loadCollectionTags(collectionHandle);
    }
  }, [collectionHandle, loadCollectionTags]);

  const availableTags = useMemo(() => {
    const combinedTags = [...new Set([...allCollectionTags, ...productTags])];
    
    const filteredTags = combinedTags.filter(tag => 
      !collectionTags.some(excludedTag => 
        tag.toLowerCase() === excludedTag.toLowerCase()
      )
    );
    
    return filteredTags.sort();
  }, [allCollectionTags, productTags, collectionTags]);

  useEffect(() => {
    if (collectionHandle !== lastCollectionHandle.current) {
      clearFilters();
    }
  }, [collectionHandle, clearFilters]);

  return {
    availableTags,
    filteredProducts,
    toggleTag,
    clearFilters,
    hasActiveFilters,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    filters,
    tagsLoading,
    tagsError,
  };
} 