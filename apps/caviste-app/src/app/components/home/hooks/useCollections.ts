import { useState, useEffect } from "react";
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

  useEffect(() => {
    async function loadCollections() {
      const response = await query(GetCollectionsDocument, { first: 10 });
      setCollections(mapGetCollectionsQueryDtoToDomain(response.data) ?? []);
    }
    loadCollections();
  }, [query]);

  return {
    collections,
    isLoadingCollections,
    collectionsError,
  };
}
