# Product Filtering System

This document describes the Shopify product filtering system implemented in the application.

## Overview

The filtering system allows filtering and sorting products according to different criteria:
- **Shopify Tags** : Filtering by tags associated with products
- **Text search** : Search in product titles and tags
- **Sorting** : Sort by name, price or date (ascending/descending order)
- **Persistence** : Filters are saved in URL to allow sharing
- **Tag exclusion** : Ability to exclude certain tags (like collection names)
- **Automatic reset** : Filters automatically reset when changing collection
- **Complete tag loading** : All tags from a collection are available via `/api/collection-products`, even if all products are not loaded

## Architecture

### Hooks

#### `useProductFilters`
Main hook for basic filter management.

```typescript
import { useProductFilters } from '../components/filters/hooks/useProductFilters';

const {
  availableTags,
  selectedTags,
  filteredProducts,
  toggleTag,
  clearFilters,
  hasActiveFilters,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  resetFilters,
} = useProductFilters(products, initialFilters, excludeTags);
```

#### `useCollectionFilters`
Specialized hook for collections with automatic reset and complete tag loading.

```typescript
import { useCollectionFilters } from '../components/filters/hooks/useCollectionFilters';

const {
  availableTags,
  selectedTags,
  filteredProducts,
  toggleTag,
  clearFilters,
  hasActiveFilters,
  setSearchQuery,
  filters,
  resetFilters,
  tagsLoading,
} = useCollectionFilters({
  products,
  collectionTitle,
  collectionHandle,
});
```

#### `useProductFilters`
Main hook for product filters with search, sorting and tag filtering.

```typescript
import { useProductFilters } from '../components/filters/hooks/useProductFilters';

const {
  filters,
  availableTags,
  filteredProducts,
  toggleTag,
  clearFilters,
  hasActiveFilters,
  setSearchQuery,
  setSortBy,
  setSortOrder,
} = useProductFilters(products, initialFilters);
```

### APIs

#### `/api/collection-products`
Retrieves collection products with pagination.

#### `/api/collection-products`
**Updated** : Retrieves collection products with pagination and extracts all unique tags.

### Utilities

#### Tag Exclusion via Shopify Metafields
**Updated**: Tags are now excluded based on the `balises` metafield defined directly in Shopify collections.

```typescript
// Collection tags are fetched from Shopify metafield "balises"
// Type: "list.single_line_text_field"
// Format: ["tag1", "tag2"] (JSON array of strings)

// Tags are automatically excluded in useCollectionFilters:
const filteredTags = combinedTags.filter(tag => 
  !collectionTags.some(excludedTag => 
    tag.toLowerCase() === excludedTag.toLowerCase()
  )
);
```

```typescript
// Usage example for tags
const response = await fetch('/api/collection-products?handle=collection-handle&first=250');
const { products, title } = await response.json();

// Extract all unique tags from products
const allTags = products.flatMap(product => product.tags || []);
const uniqueTags = [...new Set(allTags)].sort();
```

### Components

#### `FilterTagsView`
Presentational component for displaying filter UI with tags, search, and sorting.

```typescript
import { FilterTagsView } from '../components/filters';

<FilterTagsView
  availableTags={availableTags}
  selectedTags={selectedTags}
  onTagToggle={toggleTag}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  onClearFilters={clearFilters}
  sortBy={sortBy}
  onSortByChange={setSortBy}
  sortOrder={sortOrder}
  onSortOrderChange={setSortOrder}
  showSort={true}
/>
```

#### `FilterTagsView`
Vue des filtres avec interface utilisateur.

```typescript
import { FilterTagsView } from '../components/filters';

<FilterTagsView
  availableTags={availableTags}
  selectedTags={selectedTags}
  onToggleTag={toggleTag}
  onClearFilters={clearFilters}
  hasActiveFilters={hasActiveFilters}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  sortBy={sortBy}
  onSortByChange={setSortBy}
  sortOrder={sortOrder}
  onSortOrderChange={setSortOrder}
  showSearch={true}
  showSort={true}
  showTags={true}
/>
```

## Utilisation

### In the Popup (Collections)

The popup uses the specialized hook `useCollectionFilters` which:
- Exclut automatiquement le nom de la collection des tags disponibles
- Réinitialise les filtres lors du changement de collection
- Gère la persistance des filtres par collection
- **Charge tous les tags de la collection** via l'API `/api/collection-products`
- Combine les tags complets avec ceux des produits chargés

```typescript
// PopupContainer.tsx
const {
  availableTags,
  selectedTags,
  filteredProducts,
  toggleTag,
  clearFilters,
  hasActiveFilters,
  setSearchQuery,
  filters,
  tagsLoading,
} = useCollectionFilters({
  products,
  collectionTitle: title,
  collectionHandle,
});
```

### In Collection Popups

Collections use the filtering system with tag exclusion based on Shopify metafields:

```typescript
// PopupContainer.tsx
import { useCollectionFilters } from '../filters/hooks/useCollectionFilters';

const { availableTags, selectedTags, filteredProducts } = useCollectionFilters({
  products,
  collectionTitle: title,
  collectionHandle: handle,
  collectionTags: ["pour-le-repas"] // From Shopify metafield
});
```

### Filtres depuis l'URL

Le système peut initialiser les filtres depuis les paramètres URL :

```typescript
// URL: /products?tags=vin,rouge&search=chateau&sort=price&order=desc

const initialFilters = parseFiltersFromUrl();
// Result: {
//   selectedTags: ['vin', 'rouge'],
//   searchQuery: 'chateau',
//   sortBy: 'price',
//   sortOrder: 'desc'
// }
```

## Configuration

### Available Filter Types

| Filter | Description | Values |
|--------|-------------|---------|
| `selectedTags` | Selected tags | `string[]` |
| `searchQuery` | Search query | `string` |
| `sortBy` | Sort criteria | `'name' \| 'price'` |
| `sortOrder` | Sort order | `'asc' \| 'desc'` |
| `priceRange` | Price range | `{ min: number \| null, max: number \| null }` |
| `availability` | Availability | `'all' \| 'in-stock' \| 'out-of-stock'` |

### Display Options

| Option | Description | Default |
|--------|-------------|---------|
| `showSearch` | Show search bar | `true` |
| `showSort` | Show sort options | `true` |
| `showTags` | Show tag filters | `true` |
| `excludeTags` | Tags to exclude from list | `[]` |

## Usage Examples

### Collection Filtering with Metafield Integration

```typescript
import { useCollectionFilters } from '../components/filters/hooks/useCollectionFilters';

const { 
  availableTags, 
  selectedTags, 
  filteredProducts, 
  toggleTag, 
  clearFilters 
} = useCollectionFilters({
  products,
  collectionTitle: "Pour le repas",
  collectionHandle: "pour-le-repas",
  collectionTags: ["pour-le-repas"] // From Shopify metafield "balises"
});
```

### Basic Product Filtering

```typescript
import { useProductFilters } from '../components/filters/hooks/useProductFilters';

const { 
  availableTags, 
  selectedTags, 
  filteredProducts, 
  toggleTag, 
  setSearchQuery 
} = useProductFilters(products);
```

### Complete Filter UI

```typescript
import { FilterTagsView } from '../components/filters';

<FilterTagsView
  availableTags={availableTags}
  selectedTags={selectedTags}
  onTagToggle={toggleTag}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  onClearFilters={clearFilters}
  showSort={true}
/>
```

### Advanced Filtering

```typescript
const {
  filters,
  filteredProducts,
  toggleTag,
  clearFilters,
  hasActiveFilters,
  setSearchQuery,
  setSortBy,
  setSortOrder,
} = useProductFilters(products);

// Select tags
toggleTag('vin-leger');
toggleTag('pour-apero');

// Search for products
setSearchQuery('rouge');

// Sort by descending price
setSortBy('price');
setSortOrder('desc');

// Check if there are active filters
if (hasActiveFilters) {
  clearFilters(); // Clear all filters
}
```

## Special Features

### Complete Tag Loading

**Updated** : The system now loads all tags from a collection via `/api/collection-products`, even if all products are not yet loaded.

#### Problem solved
Before: Filters were based only on loaded products (12 by default)
Now: All collection tags are available from the start via `/api/collection-products`

#### API `/api/collection-products`
```typescript
// Get all tags from a collection (up to 250 products)
const response = await fetch('/api/collection-products?handle=collection-handle&first=250');
const { products, title } = await response.json();

// Extract all unique tags from products
const allTags = products.flatMap(product => product.tags || []);
const uniqueTags = [...new Set(allTags)].sort();
```

#### Hook `useCollectionFilters`
```typescript
// Combine complete tags with loaded product tags
const availableTags = useMemo(() => {
  const combinedTags = [...new Set([...allCollectionTags, ...productTags])];
  // Excludes collection name
  return filteredTags.sort();
}, [allCollectionTags, productTags, collectionTitle, collectionHandle]);
```

### Tag Exclusion

The system allows automatically excluding certain tags from the list of available filters using a three-level exclusion strategy:

#### **1. Explicit Collection Mapping**
```typescript
export const COLLECTION_TAG_MAPPING: Record<string, string[]> = {
  'pour-le-repas': ['pour-repas'],
  'pour-un-moment-a-deux': ['moment-a-deux'],
  'a-offrir-en-cadeau': ['cadeau'],
};
```

#### **2. Collection Title Fallback**
If no explicit mapping exists, the collection title is used as a fallback.

#### **3. Collection Handle**
The collection handle is always excluded to avoid redundancy.

#### **Case-Insensitive Comparison**
All tag comparisons are case-insensitive for better user experience.

This is particularly useful for:
- **Collections** : Exclude collection name from available tags
- **System tags** : Exclude internal or technical tags
- **Redundant tags** : Avoid duplication with other filters

```typescript
// Automatic exclusion in useCollectionFilters using Shopify metafield data
const filteredTags = combinedTags.filter(tag => 
  !collectionTags.some(excludedTag => 
    tag.toLowerCase() === excludedTag.toLowerCase()
  )
);

// Manual exclusion with specific tags
useProductFilters(products, undefined, ['tag1', 'tag2', 'tag3']);
```

### Automatic Reset

The `useCollectionFilters` hook automatically resets filters when:
- User changes collection
- Collection products change
- Collection handle changes

### Selected Tags Style

Selected tags have a distinctive style:
- **Background color** : `bg-primary-600` (primary blue)
- **Text color** : `text-white`
- **Visual effect** : `shadow-md` and `transform scale-105`
- **Transition** : Smooth 200ms animation

## Performance

The system uses `useMemo` and `useCallback` to optimize performance:

- Filters are recalculated only when data changes
- Callback functions are memoized
- Available tag lists are deduplicated and sorted
- Tag exclusion is optimized with case-insensitive comparisons
- **Tag loading is asynchronous** and doesn't impact initial display

## Extensibility

The system is designed to be easily extensible:

1. **New filter types** : Add to the `ProductFilters` interface
2. **New sort options** : Extend the `sortBy` type
3. **Custom components** : Create new view components
4. **Specialized hooks** : Create hooks for specific use cases
5. **Advanced tag exclusion** : Implement complex exclusion rules
6. **Specialized APIs** : Create APIs for specific data

## Tests

The system includes tests for:

- Filtering logic
- State management
- URL parameter parsing
- Interface components
- Tag exclusion
- Automatic reset
- **Asynchronous tag loading**

## Test Page

Unit tests are available in `app/components/filters/__tests__/` for:
- Testing filters on different collections
- Verifying tag loading
- Comparing results between collections
- Diagnosing issues

## Best Practices

1. **Always use hooks** instead of recreating logic
2. **Use reusable components** for consistency
3. **Test edge cases** (products without tags, missing prices, etc.)
4. **Document new filters** added
5. **Maintain compatibility** with URL during modifications
6. **Exclude redundant tags** for better UX
7. **Reset filters** during context changes
8. **Use the tags API** for collections with many products 