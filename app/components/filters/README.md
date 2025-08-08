# Product Filtering System

This directory contains the complete filtering system for the Personal Wine Cellar application.

## 🏗️ Architecture

### Directory Structure
```
filters/
├── __tests__/                    # Unit tests
├── hooks/                       # Custom hooks
│   ├── useProductFilters.ts
│   └── useCollectionFilters.ts
├── views/                       # Presentational components
│   └── FilterTagsView.tsx
├── constants.ts                 # System constants
├── types.ts                     # TypeScript types
├── utils.ts                     # Utility functions
├── index.ts                     # Main exports
└── README.md                    # This documentation
```

## 🎯 Main Components

### `FilterTagsView`
Presentational component to display tag filters, search and sorting.

## 🔧 Hooks

### `useProductFilters`
Main hook to manage product filters.

**Features:**
- Tag filtering (AND logic)
- Text search
- Sort by name, price
- URL persistence
- Specific tag exclusion

### `useCollectionFilters`
Specialized hook for collection filters.

**Features:**
- Asynchronous collection tag loading
- Smart cache to avoid multiple calls
- Automatic collection name exclusion
- Automatic reset between collections

## 🎨 Filtering Logic

### Tag Filtering (AND)
Products must have **all** selected tags to be visible.

```typescript
// If you select ["vin-leger", "pour-apero"]
// Only products with both tags will be displayed
```

### Tag Exclusion
Tags are automatically excluded based on Shopify collection metafields:

#### **Shopify Metafield Integration**
```typescript
// Collection tags are defined in Shopify Admin via custom metafield "balises"
// Type: "list.single_line_text_field"
// Format: ["tag1", "tag2"] (JSON array of strings)

// Automatic exclusion in useCollectionFilters:
const filteredTags = combinedTags.filter(tag => 
  !collectionTags.some(excludedTag => 
    tag.toLowerCase() === excludedTag.toLowerCase()
  )
);
```

#### **Benefits**
- **Maintainable**: Tags managed directly in Shopify Admin
- **Flexible**: Support multiple tags per collection
- **Reliable**: Guaranteed matching with existing product tags
- **Case-insensitive**: Robust comparison

### URL Persistence
Filters are automatically saved in the URL:
```
/?tags=vin-leger,pour-apero&search=rouge&sort=price&order=desc
```

## 🚀 Usage

### In a Collection Popup
```typescript
import { useCollectionFilters } from '../filters/hooks/useCollectionFilters';

const { availableTags, selectedTags, toggleTag, clearFilters } = useCollectionFilters({
  products,
  collectionTitle: "Pour le repas",
  collectionHandle: "pour-le-repas",
  collectionTags: ["pour-le-repas"] // From Shopify metafield
});
```

### Using FilterTagsView
```typescript
import { FilterTagsView } from '../filters';

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

## 🧪 Tests

Tests cover:
- **Hook functionality** (`useProductFilters`):
  - Filter initialization and defaults
  - AND filtering logic for tags
  - Text search in titles and tags
  - Sorting by name, price
  - Filter cleanup and reset
  - Tag exclusion logic
- **Filter logic** (utility functions):
  - Case-insensitive tag matching
  - Case-insensitive search matching
  - Product sorting with null price handling
  - Partial word matching

```bash
npm test -- --testPathPatterns=filters
```

**Coverage:**
- ✅ `useProductFilters` - Complete hook testing (10 tests)
- ✅ Filter utilities - Core logic testing (16 tests)
- ❌ `useCollectionFilters` - Complex API mocking (deferred)
- ❌ URL utilities - Window object mocking (deferred)

## 📝 Best Practices

1. **Always use hooks** instead of reimplementing logic
2. **Use constants** for default values (no magic numbers)
3. **Test components** with different scenarios
4. **Document new filters** in this README
5. **Respect Container/Presentational** architecture
6. **Manage collection tags** via Shopify Admin metafields
7. **Follow case-insensitive** tag comparisons
8. **Use TypeScript types** for better type safety
9. **Comments in English** and explain "why" not "what"

## ❓ FAQ

### About `clearFilters`

The `clearFilters` function resets **all filters** to their default values:
- Selected tags → `[]`
- Search query → `""`
- Sort by → `"name"`
- Sort order → `"asc"`
- URL parameters → cleared

```typescript
// UI usage (user clicks "Clear" button)
<button onClick={clearFilters}>Clear Filters</button>

// System usage (programmatic reset)
useEffect(() => {
  if (collectionHandle !== lastHandle.current) {
    clearFilters(); // Auto-reset when collection changes
  }
}, [collectionHandle, clearFilters]);
```

This function works for both user-initiated and system-initiated filter resets. 