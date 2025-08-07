"use client";

import { useEffect } from "react";
import { useCollections } from "../../../hooks/useCollections";
import HomeView from "../views/HomeView";

export default function HomeContainer() {
  useEffect(() => {
    document.title = "Edouard Caviste personnel - Vins propres de vignerons";
  }, []);

  const {
    popupOpen,
    popupTitle,
    popupProducts,
    popupLoading,
    hasNextPage,
    openCollection,
    loadMore,
    closePopup,
  } = useCollections();

  return (
    <HomeView
      popupOpen={popupOpen}
      popupTitle={popupTitle}
      popupProducts={popupProducts}
      popupLoading={popupLoading}
      hasNextPage={hasNextPage}
      onItemClick={openCollection}
      onLoadMore={loadMore}
      onClosePopup={closePopup}
    />
  );
} 