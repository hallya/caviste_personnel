import { PageHeader, Carousel, IntroText } from "@pkg/design-system";
import { Popup } from "@pkg/catalog";
import type { Collection } from "@pkg/domain";
import SocialLinks from "./SocialLinks";
import { ProductCollectionSortKeys } from "@pkg/services-shopify";

interface HomeViewProps {
  collections: Collection[];
  isLoadingCollections: boolean;
  collectionsError: string | null;
  isPopupOpen: boolean;
  popupTitle: string;
  popupHandle: string;
  popupCollectionTags: string[] | null;
  onItemClick: (
    handle: string,
    title: string,
    collectionTags: string[] | null,
    sortKey: ProductCollectionSortKeys
  ) => Promise<void>;
  onClosePopup: () => void;
}

export default function HomeView({
  collections,
  isLoadingCollections,
  collectionsError,
  isPopupOpen,
  popupTitle,
  popupHandle,
  popupCollectionTags,
  onItemClick,
  onClosePopup,
}: HomeViewProps) {
  return (
    <main className="min-h-screen overflow-hidden touch-pan-y flex flex-col gap-10">
      <PageHeader isHomePage={true} />
      <SocialLinks />
      <IntroText />

      {isPopupOpen && (
        <Popup
          title={popupTitle}
          onClose={onClosePopup}
          collectionHandle={popupHandle}
          collectionTags={popupCollectionTags}
        />
      )}

      <Carousel
        collections={collections}
        isLoading={isLoadingCollections}
        error={collectionsError}
        onItemClick={onItemClick}
      />
    </main>
  );
}
