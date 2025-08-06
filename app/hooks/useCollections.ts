import { useState, useCallback } from "react";
import { SimplifiedCollection, SimplifiedProduct } from "../types/shopify";

interface UseCollectionsReturn {
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
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [currentHandle, setCurrentHandle] = useState("");
  const [popupProducts, setPopupProducts] = useState<SimplifiedProduct[]>([]);
  const [popupLoading, setPopupLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const loadCollection = useCallback(async (handle: string, lastCursor?: string | null) => {
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
  }, []);

  const openCollection = useCallback(async (handle: string, title: string) => {
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
  }, [loadCollection]);

  const loadMore = useCallback(async () => {
    if (!currentHandle || !nextCursor) return;
    setPopupLoading(true);
    try {
      const { products, pageInfo } = await loadCollection(currentHandle, nextCursor);
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