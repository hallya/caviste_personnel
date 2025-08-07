"use client";

import { useEffect } from "react";
import PopupView from "../views/PopupView";
import type { SimplifiedProduct } from "../../../types/shopify";

interface PopupContainerProps {
  title: string;
  onClose: () => void;
  products: SimplifiedProduct[];
  loading: boolean;
  hasNext: boolean;
  onLoadMore: () => void;
}

export default function PopupContainer({
  title,
  onClose,
  products,
  loading,
  hasNext,
  onLoadMore,
}: PopupContainerProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <PopupView
      title={title}
      onClose={onClose}
      products={products}
      loading={loading}
      hasNext={hasNext}
      onLoadMore={onLoadMore}
    />
  );
} 