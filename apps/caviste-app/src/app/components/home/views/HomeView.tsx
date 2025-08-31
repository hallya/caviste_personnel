import { PageHeader, Carousel, IntroText } from "@pkg/design-system";
import { Popup } from "@pkg/catalog";
import type { Collection, Product } from "@pkg/domain";
import SocialLinks from "./SocialLinks";
import { ProductCollectionSortKeys } from "@pkg/services-shopify";

interface HomeViewProps {
  collections: Collection[];
  collectionsLoading: boolean;
  collectionsError: string | null;
  popupOpen: boolean;
  popupTitle: string;
  popupHandle: string;
  popupCollectionTags: string[] | null;
  popupProducts: Product[];
  popupLoading: boolean;
  hasNextPage: boolean;
  onItemClick: (
    handle: string,
    title: string,
    collectionTags: string[] | null,
    sortKey: ProductCollectionSortKeys
  ) => Promise<void>;
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
    <main className="bg-primary-50 min-h-screen overflow-hidden touch-pan-y">
      <PageHeader isHomePage={true} />
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
