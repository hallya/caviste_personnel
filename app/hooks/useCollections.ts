import { useState, useCallback, useEffect, useRef } from "react";
import { SimplifiedCollection, SimplifiedProduct } from "../types/shopify";
import type { Collection } from "../components/carousel/types";

interface UseCollectionsReturn {
  collections: Collection[];
  collectionsLoading: boolean;
  collectionsError: string | null;

  popupOpen: boolean;
  popupTitle: string;
  popupHandle: string;
  popupCollectionTags: string[];
  popupProducts: SimplifiedProduct[];
  popupLoading: boolean;
  hasNextPage: boolean;

  openCollection: (
    handle: string,
    title: string,
    collectionTags?: string[]
  ) => Promise<void>;
  loadMore: () => Promise<void>;
  closePopup: () => void;
}

export function useCollections(): UseCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupHandle, setPopupHandle] = useState("");
  const [popupCollectionTags, setPopupCollectionTags] = useState<string[]>([]);
  const [popupProducts, setPopupProducts] = useState<SimplifiedProduct[]>([]);
  const [popupLoading, setPopupLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const hasLoaded = useRef(false);

  const loadCollections = useCallback(async () => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    try {
      setCollectionsLoading(true);
      setCollectionsError(null);

      const response = await fetch("/api/collections", { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const { collections } = await response.json();
      setCollections(collections || []);
      hasLoaded.current = true;
    } catch (error) {
      console.error("Erreur lors du chargement des collections:", error);
      setCollectionsError(
        error instanceof Error ? error.message : "Erreur inconnue"
      );
    } finally {
      setCollectionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const loadCollection = useCallback(
    async (handle: string, lastCursor?: string | null) => {
      const params = new URLSearchParams();
      params.set("handle", handle);
      params.set("first", "50"); // Increased from 12 to 50 to get more tags
      if (lastCursor) {
        params.set("after", lastCursor);
      }

      const res = await fetch(`/api/collection-products?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("fetch failed");
      return res.json() as Promise<SimplifiedCollection>;
    },
    []
  );

  const openCollection = useCallback(
    async (handle: string, title: string, collectionTags: string[] = []) => {
      setPopupOpen(true);
      setPopupLoading(true);
      setPopupHandle(handle);
      setPopupCollectionTags(collectionTags);
      setPopupProducts([]);
      setNextCursor(null);

      try {
        const { products, pageInfo } = await loadCollection(handle);
        setPopupTitle(title ?? handle);
        setPopupProducts(products);
        setNextCursor(pageInfo.endCursor);
        setHasNextPage(pageInfo.hasNextPage);
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
      const { products, pageInfo } = await loadCollection(
        popupHandle,
        nextCursor
      );
      setPopupProducts((prev) => [...prev, ...products]);
      setNextCursor(pageInfo.endCursor);
      setHasNextPage(pageInfo.hasNextPage);
    } finally {
      setPopupLoading(false);
    }
  }, [popupHandle, nextCursor, loadCollection]);

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
