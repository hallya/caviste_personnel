"use client";

import { useState, useEffect } from "react";
import Popup from "./components/popup/Popup";
import IntroText from "./components/introText/IntroText";
import Carousel from "./components/carousel/Carousel";
import { CollectionProducts, Product } from "./api/collection-products/route";

export default function HomePage() {
  useEffect(() => {
    document.title = "Edouard Caviste personnel - Vins propres de vignerons";
  }, []);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState<string>("");
  const [currentHandle, setCurrentHandle] = useState<string>("");
  const [popupProducts, setPopupProducts] = useState<Product[]>([]);
  const [popupLoading, setPopupLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [, setHasNextPage] = useState(false);

  async function loadCollection(handle: string, lastCursor?: string | null) {
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
    return res.json() as Promise<CollectionProducts>;
  }

  async function handleItemClick(handle: string, title: string) {
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
  }

  async function handleLoadMore() {
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
  }

  return (
    <main className="bg-[#f4f1ee] min-h-screen overflow-hidden touch-pan-y space-y-10">
        <h1 className="text-center text-4xl text-[#7a2d2d] mt-8 font-prata">
          Edouard, Caviste personnel
        </h1>
        <IntroText />
        <Carousel onItemClick={handleItemClick} />
        {popupOpen && (
          <Popup
            title={popupTitle}
            products={popupProducts}
            loading={popupLoading}
            hasNext={Boolean(nextCursor)}
            onLoadMore={handleLoadMore}
            onClose={() => setPopupOpen(false)}
          />
        )}
      </main>
  );
}
