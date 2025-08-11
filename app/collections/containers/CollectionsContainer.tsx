"use client";

import type { Collection } from "../../components/carousel/types";
import { useCollectionsLogic } from "../hooks/useCollectionsLogic";
import CollectionsView from "../views/CollectionsView";

interface CollectionsContainerProps {
  initialCollections: Collection[];
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function CollectionsContainer({
  initialCollections,
  searchParams,
}: CollectionsContainerProps) {
  const {
    collections,
    searchQuery,
    sortBy,
    sortOrder,
    onSearchChange,
    onSortChange,
    onSortOrderChange,
    onClearFilters,
    popupOpen,
    popupTitle,
    popupHandle,
    popupCollectionTags,
    popupProducts,
    popupLoading,
    hasNextPage,
    onItemClick,
    onLoadMore,
    onClosePopup,
  } = useCollectionsLogic({ initialCollections, searchParams });

  return (
    <CollectionsView
      collections={collections}
      searchQuery={searchQuery}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSearchChange={onSearchChange}
      onSortChange={onSortChange}
      onSortOrderChange={onSortOrderChange}
      onClearFilters={onClearFilters}
      popupOpen={popupOpen}
      popupTitle={popupTitle}
      popupHandle={popupHandle}
      popupCollectionTags={popupCollectionTags}
      popupProducts={popupProducts}
      popupLoading={popupLoading}
      hasNextPage={hasNextPage}
      onItemClick={onItemClick}
      onLoadMore={onLoadMore}
      onClosePopup={onClosePopup}
    />
  );
}