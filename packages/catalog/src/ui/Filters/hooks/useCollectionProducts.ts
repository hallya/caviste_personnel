import { useCallback } from "react";
import {
  useShopify,
  GetCollectionProductsDocument,
  ProductCollectionSortKeys,
  mapCollectionProductQueryDtoToDomain,
} from "@pkg/services-shopify";

export function useCollectionProducts(){
  const {
    query,
    error: collectionProductsError,
    loading: isLoadingCollectionProducts,
  } = useShopify();

  const fetchCollection = useCallback(
    async (
      handle: string,
      lastCursor: string | null,
      sortKey: ProductCollectionSortKeys
    ) => {
      const res = await query(
        GetCollectionProductsDocument,
        {
          handle,
          first: 12,
          after: lastCursor,
          sortKey,
        },
        { cache: "no-store" }
      );
      return mapCollectionProductQueryDtoToDomain(res.data);
    },
    []
  );

  return {
    fetchCollection,
    isLoadingCollectionProducts,
    collectionProductsError,
  };
}
