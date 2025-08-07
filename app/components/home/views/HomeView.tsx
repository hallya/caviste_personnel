import Popup from "../../popup/Popup";
import IntroText from "../../introText/IntroText";
import Carousel from "../../carousel/Carousel";
import PageHeader from "../../PageHeader";
import type { SimplifiedProduct } from "../../../types/shopify";

interface HomeViewProps {
  popupOpen: boolean;
  popupTitle: string;
  popupProducts: SimplifiedProduct[];
  popupLoading: boolean;
  hasNextPage: boolean;
  onItemClick: (handle: string, title: string) => Promise<void>;
  onLoadMore: () => Promise<void>;
  onClosePopup: () => void;
}

export default function HomeView({
  popupOpen,
  popupTitle,
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
      <IntroText />
      <Carousel onItemClick={onItemClick} />
      {popupOpen && (
        <Popup
          title={popupTitle}
          products={popupProducts}
          loading={popupLoading}
          hasNext={hasNextPage}
          onLoadMore={onLoadMore}
          onClose={onClosePopup}
        />
      )}
    </main>
  );
} 