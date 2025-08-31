import { useState, useCallback, useEffect } from "react";
import type { Collection, Product } from "@pkg/domain";
import {
  GetCollectionProductsDocument,
  GetCollectionsDocument,
  mapGetCollectionsQueryDtoToDomain,
  ProductCollectionSortKeys,
  mapCollectionProductQueryDtoToDomain,
} from "@pkg/services-shopify";
import { useShopify } from "../services/client";

interface UseCollectionsReturn {
  collections: Collection[];
  collectionsLoading: boolean;
  collectionsError: string | null;

  popupOpen: boolean;
  popupTitle: string;
  popupHandle: string;
  popupCollectionTags: string[] | null;
  popupProducts: Product[];
  popupLoading: boolean;
  hasNextPage: boolean;

  openCollection: (
    handle: string,
    title: string,
    collectionTags: string[] | null,
    sortKey: ProductCollectionSortKeys
  ) => Promise<void>;
  loadMore: () => Promise<void>;
  closePopup: () => void;
}

export function useCollections(): UseCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>([]);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupHandle, setPopupHandle] = useState("");
  const [popupCollectionTags, setPopupCollectionTags] = useState<
    string[] | null
  >(null);
  const [popupProducts, setPopupProducts] = useState<Product[]>([]);
  const [popupLoading, setPopupLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<ProductCollectionSortKeys>(
    ProductCollectionSortKeys.CollectionDefault
  );
  const [hasNextPage, setHasNextPage] = useState(false);

  const {
    query,
    error: collectionsError,
    loading: collectionsLoading,
  } = useShopify();

  const loadCollections = useCallback(async () => {
    const response = await query(GetCollectionsDocument, { first: 10 });
    setCollections(mapGetCollectionsQueryDtoToDomain(response.data) ?? []);
  }, [query]);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollection = useCallback(
    async (
      handle: string,
      lastCursor: string | null,
      sortKey: ProductCollectionSortKeys
    ) => {
      const params = new URLSearchParams();
      params.set("handle", handle);
      params.set("first", "50"); // Increased from 12 to 50 to get more tags
      params.set("sortKey", sortKey);
      if (lastCursor) {
        params.set("after", lastCursor);
      }

      const res = await query(
        GetCollectionProductsDocument,
        {
          handle,
          first: 50,
          after: lastCursor,
          sortKey,
        },
        { cache: "no-store" }
      );
      return mapCollectionProductQueryDtoToDomain(res.data);
    },
    []
  );

  const openCollection = useCallback(
    async (
      handle: string,
      _title: string,
      collectionTags: string[] | null,
      sortKey: ProductCollectionSortKeys
    ) => {
      setPopupOpen(true);
      setPopupLoading(true);
      setPopupHandle(handle);
      setPopupCollectionTags(collectionTags);
      setPopupProducts([]);
      setNextCursor(null);
      setSortKey(sortKey);

      try {
        const collectionProducts = await loadCollection(
          handle,
          null,
          sortKey
        );
        setPopupTitle(collectionProducts?.title ?? handle);
        setPopupProducts(collectionProducts?.products ?? []);
        setNextCursor(collectionProducts?.pageInfo.endCursor ?? null);
        setHasNextPage(collectionProducts?.pageInfo.hasNextPage ?? false);
      } finally {
        setPopupLoading(false);
      }
    },
    [loadCollection]
  );

  const loadMore = useCallback(async () => {
    if (!popupHandle || !nextCursor) return;
    setPopupLoading(true);
    try {
      const collectionProducts = await loadCollection(
        popupHandle,
        nextCursor,
        sortKey
      );
      setPopupProducts((prev) => [...prev, ...collectionProducts?.products ?? []]);
      setNextCursor(collectionProducts?.pageInfo.endCursor ?? null);
      setHasNextPage(collectionProducts?.pageInfo.hasNextPage ?? false);
    } finally {
      setPopupLoading(false);
    }
  }, [popupHandle, nextCursor, loadCollection, sortKey]);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
  }, []);

  return {
    collections,
    collectionsLoading,
    collectionsError,
    popupOpen,
    popupTitle,
    popupHandle,
    popupCollectionTags,
    popupProducts,
    popupLoading,
    hasNextPage,
    openCollection,
    loadMore,
    closePopup,
  };
}
