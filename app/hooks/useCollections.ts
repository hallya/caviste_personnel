import { useState, useCallback, useEffect, useRef } from "react";
import { SimplifiedCollection, SimplifiedProduct } from "../types/shopify";
import type { Collection } from "../components/carousel/types";

interface UseCollectionsReturn {
  collections: Collection[];
  collectionsLoading: boolean;
  collectionsError: string | null;

  popupOpen: boolean;
  popupTitle: string;
  popupProducts: SimplifiedProduct[];
  popupLoading: boolean;
  hasNextPage: boolean;

  openCollection: (handle: string, title: string) => Promise<void>;
  loadMore: () => Promise<void>;
  closePopup: () => void;
}

export function useCollections(): UseCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [currentHandle, setCurrentHandle] = useState("");
  const [popupProducts, setPopupProducts] = useState<SimplifiedProduct[]>([]);
  const [popupLoading, setPopupLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Utiliser un ref pour éviter les doubles appels
  const hasLoaded = useRef(false);

  const loadCollections = useCallback(async () => {
    if (hasLoaded.current) return; // Éviter les doubles appels
    
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
  }, []); // Dépendances vides pour éviter les re-renders infinis

  const loadCollection = useCallback(
    async (handle: string, lastCursor?: string | null) => {
      const params = new URLSearchParams();
      params.set("handle", handle);
      params.set("first", "12");
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
    async (handle: string, title: string) => {
      setPopupOpen(true);
      setPopupLoading(true);
      setCurrentHandle(handle);
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
    if (!currentHandle || !nextCursor) return;
    setPopupLoading(true);
    try {
      const { products, pageInfo } = await loadCollection(
        currentHandle,
        nextCursor
      );
      setPopupProducts((prev) => [...prev, ...products]);
      setNextCursor(pageInfo.endCursor);
      setHasNextPage(pageInfo.hasNextPage);
    } finally {
      setPopupLoading(false);
    }
  }, [currentHandle, nextCursor, loadCollection]);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
  }, []);

  return {
    collections,
    collectionsLoading,
    collectionsError,
    popupOpen,
    popupTitle,
    popupProducts,
    popupLoading,
    hasNextPage,
    openCollection,
    loadMore,
    closePopup,
  };
}
