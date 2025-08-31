"use client";

import { useEffect } from "react";
import PopupView from "../views/PopupView";
import { useCollectionFilters } from "../../Filters/hooks/useCollectionFilters";
import type { Product } from "@pkg/domain";

interface PopupContainerProps {
  title: string;
  onClose: () => void;
  products: Product[];
  loading: boolean;
  hasNext: boolean;
  onLoadMore: () => void;
  collectionHandle?: string;
  collectionTags: string[] | null;
}

export default function PopupContainer({
  title,
  onClose,
  products,
  loading,
  hasNext,
  onLoadMore,
  collectionHandle = "",
  collectionTags,
}: PopupContainerProps) {
  const {
    availableTags,
    filteredProducts,
    toggleTag,
    clearFilters,
    hasActiveFilters,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    filters,
    tagsLoading,
    tagsError,
  } = useCollectionFilters({
    products,
    collectionTitle: title,
    collectionHandle,
    collectionTags,
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    };
  }, []);

  return (
    <PopupView
      title={title}
      onClose={onClose}
      products={products}
      filteredProducts={filteredProducts}
      loading={loading || tagsLoading}
      hasNext={hasNext}
      onLoadMore={onLoadMore}
      availableTags={availableTags}
      selectedTags={filters.selectedTags}
      onToggleTag={toggleTag}
      onClearFilters={clearFilters}
      hasActiveFilters={hasActiveFilters}
      searchQuery={filters.searchQuery}
      onSearchChange={setSearchQuery}
      sortBy={filters.sortBy}
      onSortByChange={setSortBy}
      sortOrder={filters.sortOrder}
      onSortOrderChange={setSortOrder}
      collectionHandle={collectionHandle}
      tagsError={tagsError}
    />
  );
}
