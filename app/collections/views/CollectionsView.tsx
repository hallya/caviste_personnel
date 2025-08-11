import type { Collection } from "../../components/carousel/types";
import type { SimplifiedProduct } from "../../types/shopify";
import PageHeader from "../../components/PageHeader";
import Carousel from "../../components/carousel/Carousel";
import Popup from "../../components/popup/Popup";
import CollectionsFilters from "./CollectionsFilters";

interface CollectionsViewProps {
  collections: Collection[];
  searchQuery: string;
  sortBy: "name" | "handle";
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onSortChange: (sortBy: "name" | "handle") => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
  onClearFilters: () => void;
  popupOpen: boolean;
  popupTitle: string;
  popupHandle: string;
  popupCollectionTags: string[];
  popupProducts: SimplifiedProduct[];
  popupLoading: boolean;
  hasNextPage: boolean;
  onItemClick: (handle: string, title?: string, collectionTags?: string[]) => Promise<void>;
  onLoadMore: () => Promise<void>;
  onClosePopup: () => void;
}

export default function CollectionsView({
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
}: CollectionsViewProps) {
  const hasActiveFilters = Boolean(searchQuery || sortBy !== "name" || sortOrder !== "asc");

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nos Collections
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Découvrez notre sélection de vins organisée par collections thématiques.
          </p>
          
          <CollectionsFilters
            searchQuery={searchQuery}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={onSearchChange}
            onSortChange={onSortChange}
            onSortOrderChange={onSortOrderChange}
            onClearFilters={onClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {collections.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Aucune collection trouvée pour &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          <Carousel 
            collections={collections}
            isLoading={false}
            error={null}
            onItemClick={onItemClick}
          />
        )}
      </div>

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
    </div>
  );
}