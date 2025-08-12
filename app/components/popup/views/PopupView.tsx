import PopupHeader from "../PopupHeader";
import PopupFooter from "../PopupFooter";
import ProductCard from "../ProductCard";
import FilterTagsView from "../../filters/views/FilterTagsView";
import type { SimplifiedProduct } from "../../../types/shopify";
import type { SortBy, SortOrder } from "../../filters/types";

interface PopupViewProps {
  title: string;
  onClose: () => void;
  products: SimplifiedProduct[];
  filteredProducts: SimplifiedProduct[];
  loading: boolean;
  hasNext: boolean;
  onLoadMore: () => void;
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  sortBy?: SortBy;
  onSortByChange?: (sortBy: SortBy) => void;
  sortOrder?: SortOrder;
  onSortOrderChange?: (order: SortOrder) => void;
  collectionHandle?: string;
  tagsError?: string | null;
}

export default function PopupView({
  title,
  onClose,
  filteredProducts,
  loading,
  hasNext,
  onLoadMore,
  availableTags,
  selectedTags,
  onToggleTag,
  onClearFilters,
  hasActiveFilters,
  searchQuery = '',
  onSearchChange,
  sortBy = 'name',
  onSortByChange,
  sortOrder = 'asc',
  onSortOrderChange,
  tagsError,
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
          
          {tagsError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                Erreur lors du chargement des tags : {tagsError}
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
              <ProductCard key={product.id} product={product} />
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