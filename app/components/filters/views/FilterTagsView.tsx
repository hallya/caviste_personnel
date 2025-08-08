import { SORT_OPTIONS, SORT_ORDER_OPTIONS } from '../constants';
import { SortIcon, SortOrderIcon, SearchIcon, ClearIcon } from '../../design-system/icons';
import type { FilterTagsViewProps } from '../types';

export default function FilterTagsView({
  availableTags,
  selectedTags = [],
  onToggleTag,
  onClearFilters,
  hasActiveFilters,
  searchQuery = '',
  onSearchChange,
  sortBy = 'name',
  onSortByChange,
  sortOrder = 'asc',
  onSortOrderChange,
  showSearch = true,
  showSort = true,
  showTags = true,
}: FilterTagsViewProps) {
  if (!showSearch && !showSort && !showTags) {
    return null;
  }

  return (
    <div className="mb-6 space-y-4">
      {showSearch && onSearchChange && (
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          />
        </div>
      )}

      {showSort && onSortByChange && onSortOrderChange && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <SortIcon className="w-4 h-4 text-neutral-600" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as "name" | "price")}
              className="px-2 py-1 text-sm border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              title="Trier par"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <SortOrderIcon className="w-4 h-4 text-neutral-600" />
            <select
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
              className="px-2 py-1 text-sm border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              title="Ordre de tri"
            >
              {SORT_ORDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {showTags && availableTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-700">Filtres par tags</h3>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                title="Effacer les filtres"
              >
                <ClearIcon className="w-4 h-4" />
                Effacer
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onToggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-primary-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 