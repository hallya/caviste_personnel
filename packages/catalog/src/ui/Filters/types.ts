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
}

export interface UseCollectionFiltersProps {
  collectionHandle: string;
  collectionTags: string[] | null;
}

export interface FilterTagsViewProps {
  availableTags: string[];
  hasActiveFilters: boolean;
  searchQuery?: string;
  selectedTags?: string[];
  showSearch?: boolean;
  showSort?: boolean;
  showTags?: boolean;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  onClearFilters: () => void;
  onSearchChange?: (query: string) => void;
  onSortByChange?: (sortBy: SortBy) => void;
  onSortOrderChange?: (order: SortOrder) => void;
  onToggleTag: (tag: string) => void;
}
