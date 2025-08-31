import type { Product } from "@pkg/domain";
import { PageHeader, Carousel } from "@pkg/design-system";
import { Popup } from "@pkg/catalog";
import { type Collection } from "@pkg/domain";
import CollectionsFilters from "./CollectionsFilters";

export interface CollectionsViewProps {
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
  popupCollectionTags: string[] | null;
  popupProducts: Product[];
  popupLoading: boolean;
  hasNextPage: boolean;
  onItemClick: (
    handle: string,
    title: string,
    collectionTags: string[] | null,
  ) => Promise<void>;
  onLoadMore: () => Promise<void>;
  onClosePopup: () => void;
  loading: boolean;
  error: string | null;
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
  loading,
  error,
}: CollectionsViewProps) {
  const hasActiveFilters = Boolean(
    searchQuery || sortBy !== "name" || sortOrder !== "asc",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nos Collections
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Découvrez notre sélection de vins organisée par collections
            thématiques.
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

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">
              Erreur lors du chargement des collections: {error}
            </p>
          </div>
        ) : collections.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Aucune collection trouvée pour &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          <Carousel
            collections={collections}
            isLoading={loading}
            error={error}
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
