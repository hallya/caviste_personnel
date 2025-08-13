# Test Factories

This folder contains all test factories for the project, following a centralized pattern to avoid duplication and facilitate maintenance.

## 📁 Structure

```
app/__tests__/factories/
├── api-factory.ts          # Factories for API and environment
├── shopify-factory.ts      # Factories for Shopify GraphQL data
├── collections-factory.ts  # Factories for Collections UI/SSR
├── index.ts               # Centralized re-exports
└── README.md              # This documentation
```

## 🎯 Available Factories

### **API & Environment** (`api-factory.ts`)
```typescript
import { createMockEnvironment, setupFetchMock } from '@/__tests__/factories';
```

### **Shopify GraphQL** (`shopify-factory.ts`)
```typescript
import { CollectionFactories, createMockCollectionsResponse } from '@/__tests__/factories';

// Basic Shopify collections
const shopifyCollection = CollectionFactories.wineCollection();
const shopifyResponse = createMockCollectionsResponse([shopifyCollection]);
```

### **Collections UI/SSR** (`collections-factory.ts`) ✨ **NEW**
```typescript
import { 
  CollectionsTestFactories,     // For UI/component tests  
  CollectionsSSRFactories,      // For SSR/Shopify data
  CollectionsTestData,          // Ready-to-use datasets
  SearchParamsFactories         // URL parameters
} from '@/__tests__/factories';

// Usage examples
const collections = CollectionsTestData.defaultCollections();
const searchParams = SearchParamsFactories.withSearch('rouge');
const shopifySSR = CollectionsSSRFactories.mockShopifyResponse();
```

## 🚀 Usage in Tests

### Standard Import
```typescript
// ✅ Import from central point
import { CollectionsTestFactories, SearchParamsFactories } from '../../__tests__/factories';

// ❌ Avoid direct imports
import { CollectionsTestFactories } from '../../__tests__/factories/collections-factory';
```

### Practical Examples

#### UI Component Test
```typescript
import { CollectionsTestData } from '../../__tests__/factories';

it('should render collections', () => {
  const collections = CollectionsTestData.defaultCollections();
  render(<CollectionsView collections={collections} />);
  expect(screen.getByText('Vins Rouges')).toBeInTheDocument();
});
```

#### SSR Test with Shopify
```typescript
import { CollectionsSSRFactories } from '../../__tests__/factories';

it('should fetch SSR data', async () => {
  const mockResponse = CollectionsSSRFactories.mockShopifyResponse();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockResponse),
  });
  
  const page = await CollectionsPage({ searchParams: Promise.resolve({}) });
  render(page);
  expect(screen.getByTestId('collections-container')).toBeInTheDocument();
});
```

#### Search/Filtering Test
```typescript
import { CollectionsTestFactories, SearchParamsFactories } from '../../__tests__/factories';

it('should filter collections', () => {
  const collections = CollectionsTestFactories.searchableCollections();
  const searchParams = SearchParamsFactories.withSearch('rouge');
  
  render(<CollectionsContainer collections={collections} searchParams={searchParams} />);
  expect(screen.getByTestId('collections-count')).toHaveTextContent('1');
});
```

## 🔧 Conventions

### ✅ Best Practices
1. **Centralized import**: Always from `'../../__tests__/factories'`
2. **Explicit naming**: `defaultCollections()`, `searchableCollections()`
3. **Reusability**: Extend existing factories when possible
4. **TypeScript**: Complete types for all factories
5. **Documentation**: Comment non-obvious use cases

### ✅ Factory Structure
```typescript
// Standard pattern for factories
export const NameFactories = {
  // Basic factory with defaults
  basicItem: (overrides: Partial<ItemOptions> = {}) => 
    createItem({ ...defaults, ...overrides }),
  
  // Specialized factory for use cases
  specializedItems: () => [...], // Array for specific tests
  
  // Factory with transformation
  fromExternalData: (externalData) => convertToInternalFormat(externalData),
};
```

### ✅ Factory Tests
- Each factory should have its own tests in `**/*.test.ts`
- Verify default values and overrides
- Test data transformations
- Document use cases in tests

## 📊 Centralized Pattern Benefits

| **Aspect** | **Before** | **After** |
|------------|-----------|-----------|
| **Duplication** | Hardcoded data everywhere | ✅ Reusable factories |
| **Maintenance** | Changes in N places | ✅ Centralized changes |
| **Consistency** | Variations between tests | ✅ Harmonized data |
| **Discoverability** | Hard to find | ✅ Obvious central import |
| **Extensions** | Reinvent each time | ✅ Extend existing |

## 🎓 Adding New Factories

1. **Create** the `name-factory.ts` file in this folder
2. **Implement** following existing patterns
3. **Export** from `index.ts`
4. **Test** in `name-factory.test.ts`
5. **Document** in this README

```typescript
// Example of new factory
export const NewFeatureFactories = {
  basicItem: (overrides = {}) => ({ ...defaults, ...overrides }),
  specialCases: () => [...],
};
```

**Centralized factories simplify tests and improve code quality! 🚀**