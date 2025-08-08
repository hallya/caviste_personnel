import type { SimplifiedProduct } from "../../types/shopify";

export type SortBy = "name" | "price";
export type SortOrder = "asc" | "desc";

export interface ProductFilters {
  selectedTags: string[];
  searchQuery?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface UseProductFiltersReturn {
  filters: ProductFilters;
  availableTags: string[];
  filteredProducts: SimplifiedProduct[];
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: ProductFilters["sortBy"]) => void;
  setSortOrder: (order: ProductFilters["sortOrder"]) => void;
  getFilteredAndSortedProducts: () => SimplifiedProduct[];
}



export interface UseCollectionFiltersProps {
  products: SimplifiedProduct[];
  collectionTitle: string;
  collectionHandle: string;
  collectionTags?: string[];
}

export interface UseCollectionFiltersReturn {
  availableTags: string[];
  filteredProducts: SimplifiedProduct[];
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: ProductFilters["sortBy"]) => void;
  setSortOrder: (order: ProductFilters["sortOrder"]) => void;
  filters: ProductFilters;
  tagsLoading: boolean;
  tagsError: string | null;
}

export interface FilterTagsViewProps {
  availableTags: string[];
  selectedTags?: string[];
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  sortBy?: SortBy;
  onSortByChange?: (sortBy: SortBy) => void;
  sortOrder?: SortOrder;
  onSortOrderChange?: (order: SortOrder) => void;
  showSearch?: boolean;
  showSort?: boolean;
  showTags?: boolean;
}
