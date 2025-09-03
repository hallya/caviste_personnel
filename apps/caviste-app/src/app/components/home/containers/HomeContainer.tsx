"use client";

import { useEffect } from "react";
import HomeView from "../views/HomeView";
import { useHome } from "../hooks/useHome";

export default function HomeContainer() {
  useEffect(() => {
    document.title = "Edouard Caviste personnel - Vins propres de vignerons";
  }, []);

  const {
    collections,
    isLoadingCollections,
    collectionsError,
    isPopupOpen,
    popupTitle,
    popupHandle,
    popupCollectionTags,
    openCollection,
    closePopup,
  } = useHome();

  return (
    <HomeView
      collections={collections}
      isLoadingCollections={isLoadingCollections}
      collectionsError={collectionsError}
      isPopupOpen={isPopupOpen}
      popupTitle={popupTitle}
      popupHandle={popupHandle}
      popupCollectionTags={popupCollectionTags}
      onItemClick={openCollection}
      onClosePopup={closePopup}
    />
  );
}
