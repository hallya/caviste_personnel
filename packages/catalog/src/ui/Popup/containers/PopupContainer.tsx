"use client";

import { useEffect } from "react";
import PopupView from "../views/PopupView";
import { useCollectionFilters } from "../../Filters/hooks/useCollectionFilters";

interface PopupContainerProps {
  title: string;
  onClose: () => void;
  collectionHandle: string;
  collectionTags: string[] | null;
}

export default function PopupContainer({
  title,
  onClose,
  collectionHandle,
  collectionTags,
}: PopupContainerProps) {
  const {
    availableTags,
    collectionError,
    filteredProducts,
    filters,
    hasActiveFilters,
    hasNextPage,
    isLoadingCollectionProducts,
    clearFilters,
    onLoadMore,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    toggleTag,
  } = useCollectionFilters({
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
      products={filteredProducts}
      onClose={onClose}
      filteredProducts={filteredProducts}
      loading={isLoadingCollectionProducts}
      hasNext={hasNextPage}
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
      collectionError={collectionError}
    />
  );
}
