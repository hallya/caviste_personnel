import PopupHeader from "../PopupHeader";
import PopupFooter from "../PopupFooter";
import ProductCard from "../ProductCard";
import FilterTagsView from "../../Filters/views/FilterTagsView";
import type { Product } from "@pkg/domain";
import type { SortBy, SortOrder } from "../../Filters/types";

export interface PopupViewProps {
  availableTags: string[];
  collectionError?: string | null;
  collectionHandle?: string;
  filteredProducts: Product[];
  hasActiveFilters: boolean;
  hasNext: boolean;
  loading: boolean;
  products: Product[];
  searchQuery?: string;
  selectedTags: string[];
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  title: string;
  onClearFilters: () => void;
  onClose: () => void;
  onLoadMore: () => void;
  onSearchChange?: (query: string) => void;
  onSortByChange?: (sortBy: SortBy) => void;
  onSortOrderChange?: (order: SortOrder) => void;
  onToggleTag: (tag: string) => void;
}

export default function PopupView({
  availableTags,
  collectionError,
  filteredProducts,
  hasActiveFilters,
  hasNext,
  loading,
  searchQuery = "",
  selectedTags,
  sortBy = "name",
  sortOrder = "asc",
  title,
  onClearFilters,
  onClose,
  onLoadMore,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
  onToggleTag,
}: PopupViewProps) {
  const gridId = "collection-products-grid";

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/60 flex justify-center items-center z-modal animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div className="bg-primary-50 rounded-xl w-[95vw] max-w-[90vw] h-[80vh] shadow-lg animate-scaleIn relative flex flex-col">
        <PopupHeader title={title} onClose={onClose} />

        <main className="flex-1 overflow-y-auto px-8 py-4">
          <p className="sr-only" aria-live="polite">
            {loading ? "Chargement des produits…" : ""}
          </p>

          {collectionError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                Erreur lors du chargement des produits : {collectionError}
              </p>
            </div>
          )}

          <FilterTagsView
            availableTags={availableTags}
            selectedTags={selectedTags}
            onToggleTag={onToggleTag}
            onClearFilters={onClearFilters}
            hasActiveFilters={hasActiveFilters}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            sortBy={sortBy}
            onSortByChange={onSortByChange}
            sortOrder={sortOrder}
            onSortOrderChange={onSortOrderChange}
            showSearch={true}
            showSort={true}
          />

          <section
            id={gridId}
            className="grid gap-4 auto-rows-fr grid-cols-[repeat(auto-fill,minmax(200px,1fr))] max-w-full"
            aria-label={`Liste des produits de ${title}`}
            aria-busy={loading ? "true" : "false"}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.variantId} product={product} />
            ))}
          </section>
        </main>

        <PopupFooter
          hasNext={hasNext}
          loading={loading}
          onLoadMore={onLoadMore}
          gridId={gridId}
        />
      </div>
    </div>
  );
}
