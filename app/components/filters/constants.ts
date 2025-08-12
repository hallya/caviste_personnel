export const DEFAULT_FILTERS = {
  selectedTags: [] as string[],
  searchQuery: "",
  sortBy: "name" as const,
  sortOrder: "asc" as const,
} as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Nom" },
  { value: "price", label: "Prix" },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: "asc", label: "Croissant" },
  { value: "desc", label: "Décroissant" },
] as const;

export const URL_PARAMS = {
  TAGS: "tags",
  SEARCH: "search",
  SORT: "sort",
  ORDER: "order",
} as const;

export const DEFAULT_PROPS = {
  showSearch: true,
  showSort: true,
  showTags: true,
  className: "",
  title: "Filtres",
} as const;

export const TIMING = {
  MILLISECONDS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
} as const;

export const API_LIMITS = {
  MAX_PRODUCTS_PER_COLLECTION: 250,
} as const;

export const CACHE_CONFIG = {
  MAX_SIZE: 50,
  TTL:
    5 *
    TIMING.MINUTES_PER_HOUR *
    TIMING.SECONDS_PER_MINUTE *
    TIMING.MILLISECONDS_PER_SECOND, // 5 hours in milliseconds
} as const;

export const COLLECTION_CACHE_CONFIG = {
  MAX_SIZE: 20, // Maximum number of cached collections
  TTL_MS: 5 * TIMING.SECONDS_PER_MINUTE * TIMING.MILLISECONDS_PER_SECOND, // 5 minutes TTL for tags cache
} as const;

export const FILTER_TYPES = {
  TAG: 'tag',
  SEARCH: 'search',
  SORT: 'sort',
} as const;

export const FILTER_ACTIONS = {
  ADD: 'add',
  REMOVE: 'remove',
  CLEAR: 'clear',
} as const;

export type FilterType = typeof FILTER_TYPES[keyof typeof FILTER_TYPES];
export type FilterAction = typeof FILTER_ACTIONS[keyof typeof FILTER_ACTIONS];
