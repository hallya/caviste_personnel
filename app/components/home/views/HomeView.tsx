import Popup from "../../popup/Popup";
import IntroText from "../../introText/IntroText";
import Carousel from "../../carousel/Carousel";
import PageHeader from "../../PageHeader";
import SocialLinks from "./SocialLinks";
import type { SimplifiedProduct } from "../../../types/shopify";
import type { Collection } from "../../carousel/types";

interface HomeViewProps {
  collections: Collection[];
  collectionsLoading: boolean;
  collectionsError: string | null;
  popupOpen: boolean;
  popupTitle: string;
  popupHandle: string;
  popupCollectionTags: string[];
  popupProducts: SimplifiedProduct[];
  popupLoading: boolean;
  hasNextPage: boolean;
  onItemClick: (handle: string, title: string, collectionTags?: string[]) => Promise<void>;
  onLoadMore: () => Promise<void>;
  onClosePopup: () => void;
}

export default function HomeView({
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
  onItemClick,
  onLoadMore,
  onClosePopup,
}: HomeViewProps) {
  return (
    <main className="bg-primary-50 min-h-screen overflow-hidden touch-pan-y space-y-10">
      <PageHeader />
      <SocialLinks />
      <IntroText />
      
      <Carousel
        collections={collections}
        isLoading={collectionsLoading}
        error={collectionsError}
        onItemClick={onItemClick}
      />
      {popupOpen && (
        <Popup
          title={popupTitle}
          products={popupProducts}
          loading={popupLoading}
          hasNext={hasNextPage}
          onLoadMore={onLoadMore}
          onClose={onClosePopup}
          collectionHandle={popupHandle}
          collectionTags={popupCollectionTags}
        />
      )}
    </main>
  );
}
