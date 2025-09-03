import { useState, useCallback, useEffect } from "react";
import type { Collection } from "@pkg/domain";
import {
  GetCollectionsDocument,
  mapGetCollectionsQueryDtoToDomain,
} from "@pkg/services-shopify";
import { useShopify } from "../../../services/client";

interface UseCollectionsReturn {
  collections: Collection[];
  isLoadingCollections: boolean;
  collectionsError: string | null;
}

export function useCollections(): UseCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>([]);

  const {
    query,
    error: collectionsError,
    loading: isLoadingCollections,
  } = useShopify();

  const loadCollections = useCallback(async () => {
    const response = await query(GetCollectionsDocument, { first: 10 });
    setCollections(mapGetCollectionsQueryDtoToDomain(response.data) ?? []);
  }, [query]);

  useEffect(() => {
    loadCollections();
  }, []);

  return {
    collections,
    isLoadingCollections,
    collectionsError,
  };
}
