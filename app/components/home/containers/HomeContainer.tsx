"use client";

import { useEffect } from "react";
import { useCollections } from "../../../hooks/useCollections";
import HomeView from "../views/HomeView";

export default function HomeContainer() {
  useEffect(() => {
    document.title = "Edouard Caviste personnel - Vins propres de vignerons";
  }, []);

  const {
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
  } = useCollections();

  return (
    <HomeView
      collections={collections}
      collectionsLoading={collectionsLoading}
      collectionsError={collectionsError}
      popupOpen={popupOpen}
      popupTitle={popupTitle}
      popupHandle={popupHandle}
      popupCollectionTags={popupCollectionTags}
      popupProducts={popupProducts}
      popupLoading={popupLoading}
      hasNextPage={hasNextPage}
      onItemClick={openCollection}
      onLoadMore={loadMore}
      onClosePopup={closePopup}
    />
  );
}