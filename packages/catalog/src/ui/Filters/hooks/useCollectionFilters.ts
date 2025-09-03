import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { useProductFilters } from "./useProductFilters";
import type {
  UseCollectionFiltersProps,
} from "../types";
import { ProductCollectionSortKeys } from "@pkg/services-shopify";
import { Product } from "@pkg/domain";
import { useCollectionProducts } from "./useCollectionProducts";

export function useCollectionFilters({
  collectionHandle,
  collectionTags = [],
}: UseCollectionFiltersProps) {
  const [allCollectionTags, setAllCollectionTags] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const lastCollectionHandle = useRef<string>("");
  const {
    fetchCollection,
    isLoadingCollectionProducts,
    collectionProductsError: collectionError,
  } = useCollectionProducts();

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
  } = useProductFilters(products, undefined, [collectionHandle]);

  const loadCollectionProducts = useCallback(
    async (handle: string) => {
      if (!handle) return;

      const data = await fetchCollection(
        handle,
        null,
        ProductCollectionSortKeys.Created
      );
      const products = data?.products || [];

      const allTags = products.flatMap(
        (product: { tags: string[] }) => product.tags || []
      );
      const uniqueTags = [...new Set(allTags)]
        .filter((tag): tag is string => typeof tag === "string")
        .sort();

      setProducts(products);
      setAllCollectionTags(uniqueTags);
      setNextCursor(data?.pageInfo.endCursor ?? null);
      setHasNextPage(data?.pageInfo.hasNextPage ?? false);
    },
    [
      fetchCollection,
      setProducts,
      setAllCollectionTags,
      setNextCursor,
      setHasNextPage,
    ]
  );

  const onLoadMore = useCallback(async () => {
    const data = await fetchCollection(
      collectionHandle,
      nextCursor,
      ProductCollectionSortKeys.Created
    );
    setProducts((prev) => [...prev, ...(data?.products ?? [])]);
    setNextCursor(data?.pageInfo.endCursor ?? null);
    setHasNextPage(data?.pageInfo.hasNextPage ?? false);
  }, [
    collectionHandle,
    nextCursor,
    fetchCollection,
    setProducts,
    setNextCursor,
    setHasNextPage,
  ]);

  useEffect(() => {
    if (collectionHandle && collectionHandle !== lastCollectionHandle.current) {
      lastCollectionHandle.current = collectionHandle;
      loadCollectionProducts(collectionHandle);
    }
  }, [collectionHandle, loadCollectionProducts]);

  const availableTags = useMemo(() => {
    const combinedTags = [...new Set([...allCollectionTags, ...productTags])];
    const filteredTags = combinedTags.filter(
      (tag) =>
        !collectionTags?.some(
          (excludedTag) => tag.toLowerCase() === excludedTag.toLowerCase()
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
    collectionError,
    filteredProducts,
    filters,
    hasActiveFilters,
    hasNextPage,
    isLoadingCollectionProducts,
    clearFilters,
    onLoadMore,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    toggleTag,
  };
}
