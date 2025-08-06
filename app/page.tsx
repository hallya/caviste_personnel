"use client";

import { useEffect } from "react";
import Popup from "./components/popup/Popup";
import IntroText from "./components/introText/IntroText";
import Carousel from "./components/carousel/Carousel";
import PageHeader from "./components/PageHeader";
import { useCollections } from "./hooks/useCollections";

export default function HomePage() {
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
    <main className="bg-[#f4f1ee] min-h-screen overflow-hidden touch-pan-y space-y-10">
      <PageHeader />
      <IntroText />
      <Carousel onItemClick={openCollection} />
      {popupOpen && (
        <Popup
          title={popupTitle}
          products={popupProducts}
          loading={popupLoading}
          hasNext={hasNextPage}
          onLoadMore={loadMore}
          onClose={closePopup}
        />
      )}
    </main>
  );
}
