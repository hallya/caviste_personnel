import { Product } from "@pkg/domain";

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
  filteredProducts: Product[];
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: ProductFilters["sortBy"]) => void;
  setSortOrder: (order: ProductFilters["sortOrder"]) => void;
  getFilteredAndSortedProducts: () => Product[];
}

export interface UseCollectionFiltersProps {
  products: Product[];
  collectionTitle: string;
  collectionHandle: string;
  collectionTags: string[] | null;
}

export interface UseCollectionFiltersReturn {
  availableTags: string[];
  filteredProducts: Product[];
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
