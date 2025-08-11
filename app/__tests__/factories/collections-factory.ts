// Factory functions for Collections page and components testing
import type { Collection } from '../../components/carousel/types';
import type { ShopifyCollectionGraphQLNode } from '../../types/shopify';
import { 
  CollectionFactories, 
  createMockCollectionsResponse 
} from './shopify-factory';
import { 
  SHOPIFY_TEST_IDS, 
  SHOPIFY_HANDLES, 
  SHOPIFY_DATA 
} from '../constants/shopify';
import { TEST_URLS } from '../constants/api';

// Convert Shopify GraphQL node to internal Collection type
const convertToCollection = (node: ShopifyCollectionGraphQLNode): Collection => ({
  id: node.id,
  title: node.title,
  handle: node.handle,
  image: node.image?.url ?? null,
  videoCollection: node.metafield?.reference?.url ?? null,
  collectionTags: node.tagsMetafield?.value 
    ? JSON.parse(node.tagsMetafield.value) 
    : [],
});

interface CollectionTestOptions {
  id?: string;
  title?: string;
  handle?: string;
  image?: string | null;
  videoCollection?: string | null;
  collectionTags?: string[];
}

const createTestCollection = (options: CollectionTestOptions = {}): Collection => {
  const {
    id = SHOPIFY_TEST_IDS.COLLECTIONS.VINS_ROUGES,
    title = 'Test Collection',
    handle = 'test-collection',
    image = TEST_URLS.IMAGES.COLLECTION_1,
    videoCollection = null,
    collectionTags = [],
  } = options;

  return {
    id,
    title,
    handle,
    image,
    videoCollection,
    collectionTags,
  };
};

// Factory for standard collections used in component tests
export const CollectionsTestFactories = {
  // Basic collections for UI tests
  wineCollection: (overrides: Partial<CollectionTestOptions> = {}): Collection =>
    createTestCollection({
      id: SHOPIFY_TEST_IDS.COLLECTIONS.VINS_ROUGES,
      title: 'Vins Rouges',
      handle: SHOPIFY_HANDLES.COLLECTIONS.VINS_ROUGES,
      image: TEST_URLS.IMAGES.COLLECTION_1,
      videoCollection: TEST_URLS.VIDEOS.WINE_COLLECTION_1,
      collectionTags: ['rouge', 'leger', 'pour-apero'],
      ...overrides,
    }),

  whiteWineCollection: (overrides: Partial<CollectionTestOptions> = {}): Collection =>
    createTestCollection({
      id: SHOPIFY_TEST_IDS.COLLECTIONS.VINS_BLANCS,
      title: 'Vins Blancs',
      handle: SHOPIFY_HANDLES.COLLECTIONS.VINS_BLANCS,
      image: TEST_URLS.IMAGES.COLLECTION_1,
      videoCollection: TEST_URLS.VIDEOS.WINE_COLLECTION_1,
      collectionTags: ['blanc', 'sec'],
      ...overrides,
    }),

  collectionWithoutImage: (overrides: Partial<CollectionTestOptions> = {}): Collection =>
    createTestCollection({
      id: SHOPIFY_TEST_IDS.COLLECTIONS.SANS_IMAGE,
      title: 'Collection Sans Image',
      handle: SHOPIFY_HANDLES.COLLECTIONS.SANS_IMAGE,
      image: null,
      collectionTags: ['sans-image'],
      ...overrides,
    }),

  collectionWithoutVideo: (overrides: Partial<CollectionTestOptions> = {}): Collection =>
    createTestCollection({
      id: SHOPIFY_TEST_IDS.COLLECTIONS.SANS_VIDEO,
      title: 'Collection Sans Vidéo',
      handle: SHOPIFY_HANDLES.COLLECTIONS.SANS_VIDEO,
      image: TEST_URLS.IMAGES.COLLECTION_1,
      videoCollection: null,
      collectionTags: ['sans-video'],
      ...overrides,
    }),

  // Collections for search/filter tests
  searchableCollections: (): Collection[] => [
    createTestCollection({
      id: 'gid://shopify/Collection/search-1',
      title: 'Vins Rouges Bordeaux',
      handle: 'vins-rouges-bordeaux',
      collectionTags: ['rouge', 'bordeaux'],
    }),
    createTestCollection({
      id: 'gid://shopify/Collection/search-2',
      title: 'Vins Blancs Loire',
      handle: 'vins-blancs-loire',
      collectionTags: ['blanc', 'loire'],
    }),
    createTestCollection({
      id: 'gid://shopify/Collection/search-3',
      title: 'Champagne Festif',
      handle: 'champagne-festif',
      collectionTags: ['petillant', 'fete'],
    }),
  ],

  // Collections for sorting tests
  sortableCollections: (): Collection[] => [
    createTestCollection({
      id: 'gid://shopify/Collection/sort-1',
      title: 'A - Premier Alphabétique',
      handle: 'z-dernier-handle',
    }),
    createTestCollection({
      id: 'gid://shopify/Collection/sort-2',
      title: 'Z - Dernier Alphabétique',
      handle: 'a-premier-handle',
    }),
    createTestCollection({
      id: 'gid://shopify/Collection/sort-3',
      title: 'M - Milieu Alphabétique',
      handle: 'm-milieu-handle',
    }),
  ],
};

// Factory for SSR data (Shopify API responses)
export const CollectionsSSRFactories = {
  // Convert from Shopify factories to our Collection type
  fromShopifyNode: (node: ShopifyCollectionGraphQLNode): Collection =>
    convertToCollection(node),

  fromShopifyNodes: (nodes: ShopifyCollectionGraphQLNode[]): Collection[] =>
    nodes.map(convertToCollection),

  // Standard Shopify GraphQL response for SSR tests
  mockShopifyResponse: (collections?: ShopifyCollectionGraphQLNode[]) => {
    const defaultCollections = [
      CollectionFactories.wineCollection({
        id: SHOPIFY_TEST_IDS.COLLECTIONS.VINS_ROUGES,
        title: 'Vins Rouges',
        handle: SHOPIFY_HANDLES.COLLECTIONS.VINS_ROUGES,
        tagsJson: SHOPIFY_DATA.TAGS.VALID_JSON,
      }),
      CollectionFactories.wineCollection({
        id: SHOPIFY_TEST_IDS.COLLECTIONS.VINS_BLANCS,
        title: 'Vins Blancs',
        handle: SHOPIFY_HANDLES.COLLECTIONS.VINS_BLANCS,
        tagsJson: SHOPIFY_DATA.TAGS.BLANC_SEC,
      }),
    ];

    return createMockCollectionsResponse(collections || defaultCollections);
  },

  // Empty Shopify response for error/empty state tests
  emptyShopifyResponse: () => createMockCollectionsResponse([]),
};

// Common test data sets
export const CollectionsTestData = {
  // Standard set for most component tests
  defaultCollections: (): Collection[] => [
    CollectionsTestFactories.wineCollection(),
    CollectionsTestFactories.whiteWineCollection(),
  ],

  // Single collection for focused tests
  singleCollection: (): Collection[] => [
    CollectionsTestFactories.wineCollection(),
  ],

  // Empty set for empty state tests
  emptyCollections: (): Collection[] => [],

  // Large set for pagination/performance tests
  manyCollections: (count: number = 10): Collection[] =>
    Array.from({ length: count }, (_, index) =>
      createTestCollection({
        id: `gid://shopify/Collection/many-${index}`,
        title: `Collection ${index + 1}`,
        handle: `collection-${index + 1}`,
        collectionTags: [`tag-${index}`],
      })
    ),
};

// Search params factories for different test scenarios
export const SearchParamsFactories = {
  empty: (): Record<string, string | string[] | undefined> => ({}),
  
  withSearch: (search: string): Record<string, string | string[] | undefined> => ({
    search,
  }),

  withSort: (sort: 'name' | 'handle', order: 'asc' | 'desc' = 'asc'): Record<string, string | string[] | undefined> => ({
    sort,
    order,
  }),

  withAll: (search: string, sort: 'name' | 'handle', order: 'asc' | 'desc'): Record<string, string | string[] | undefined> => ({
    search,
    sort,
    order,
  }),

  // For Promise-based searchParams (Next.js 15)
  asPromise: (params: Record<string, string | string[] | undefined>) =>
    Promise.resolve(params),
};