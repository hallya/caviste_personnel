import { SearchIcon, SortOrderIcon, ClearIcon } from "../../components/design-system/icons";

interface CollectionsFiltersProps {
  searchQuery: string;
  sortBy: "name" | "handle";
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onSortChange: (sortBy: "name" | "handle") => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function CollectionsFilters({
  searchQuery,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortChange,
  onSortOrderChange,
  onClearFilters,
  hasActiveFilters,
}: CollectionsFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher dans les collections..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Trier par:
          </label>
          <div className="flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as "name" | "handle")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Nom</option>
              <option value="handle">Identifiant</option>
            </select>
            
            <button
              onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              title={sortOrder === "asc" ? "Tri croissant" : "Tri décroissant"}
            >
              <SortOrderIcon 
                className="h-4 w-4 text-gray-600"
              />
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent whitespace-nowrap"
          >
            <ClearIcon className="h-4 w-4" />
            Effacer
          </button>
        )}
      </div>
    </div>
  );
}