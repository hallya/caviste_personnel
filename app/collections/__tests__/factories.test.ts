/**
 * @jest-environment jsdom
 */
import { 
  CollectionsTestFactories, 
  CollectionsSSRFactories, 
  CollectionsTestData,
  SearchParamsFactories
} from '../../__tests__/factories';
import { SHOPIFY_TEST_IDS, SHOPIFY_HANDLES } from '../../__tests__/constants/shopify';

describe('Collections Test Factories', () => {
  describe('CollectionsTestFactories', () => {
    it('should create wine collection with default values', () => {
      const collection = CollectionsTestFactories.wineCollection();

      expect(collection).toEqual({
        id: SHOPIFY_TEST_IDS.COLLECTIONS.VINS_ROUGES,
        title: 'Vins Rouges',
        handle: SHOPIFY_HANDLES.COLLECTIONS.VINS_ROUGES,
        image: expect.any(String),
        videoCollection: expect.any(String),
        collectionTags: ['rouge', 'leger', 'pour-apero'],
      });
    });

    it('should allow overriding collection properties', () => {
      const collection = CollectionsTestFactories.wineCollection({
        title: 'Custom Wine Collection',
        collectionTags: ['custom', 'tag'],
      });

      expect(collection.title).toBe('Custom Wine Collection');
      expect(collection.collectionTags).toEqual(['custom', 'tag']);
      expect(collection.handle).toBe(SHOPIFY_HANDLES.COLLECTIONS.VINS_ROUGES);
    });

    it('should create collection without image', () => {
      const collection = CollectionsTestFactories.collectionWithoutImage();

      expect(collection.image).toBeNull();
      expect(collection.title).toBe('Collection Sans Image');
    });

    it('should create collection without video', () => {
      const collection = CollectionsTestFactories.collectionWithoutVideo();

      expect(collection.videoCollection).toBeNull();
      expect(collection.title).toBe('Collection Sans Vidéo');
    });

    it('should create searchable collections array', () => {
      const collections = CollectionsTestFactories.searchableCollections();

      expect(collections).toHaveLength(3);
      expect(collections[0].title).toContain('Bordeaux');
      expect(collections[1].title).toContain('Loire');
      expect(collections[2].title).toContain('Champagne');
    });

    it('should create sortable collections array', () => {
      const collections = CollectionsTestFactories.sortableCollections();

      expect(collections).toHaveLength(3);
      expect(collections.some(c => c.title.startsWith('A -'))).toBe(true);
      expect(collections.some(c => c.title.startsWith('Z -'))).toBe(true);
      expect(collections.some(c => c.title.startsWith('M -'))).toBe(true);
    });
  });

  describe('CollectionsSSRFactories', () => {
    it('should create mock Shopify response', () => {
      const response = CollectionsSSRFactories.mockShopifyResponse();

      expect(response).toHaveProperty('data');
      expect(response.data).toHaveProperty('collections');
      expect(response.data.collections).toHaveProperty('edges');
      expect(response.data.collections.edges).toHaveLength(2);
    });

    it('should create empty Shopify response', () => {
      const response = CollectionsSSRFactories.emptyShopifyResponse();

      expect(response.data.collections.edges).toHaveLength(0);
    });
  });

  describe('CollectionsTestData', () => {
    it('should provide default collections set', () => {
      const collections = CollectionsTestData.defaultCollections();

      expect(collections).toHaveLength(2);
      expect(collections[0].title).toBe('Vins Rouges');
      expect(collections[1].title).toBe('Vins Blancs');
    });

    it('should provide single collection array', () => {
      const collections = CollectionsTestData.singleCollection();

      expect(collections).toHaveLength(1);
    });

    it('should provide empty collections array', () => {
      const collections = CollectionsTestData.emptyCollections();

      expect(collections).toHaveLength(0);
    });

    it('should generate many collections with specified count', () => {
      const collections = CollectionsTestData.manyCollections(20);

      expect(collections).toHaveLength(20);
      expect(collections[0].title).toBe('Collection 1');
      expect(collections[19].title).toBe('Collection 20');
    });
  });

  describe('SearchParamsFactories', () => {
    it('should create empty search params', () => {
      const params = SearchParamsFactories.empty();

      expect(params).toEqual({});
    });

    it('should create search params with search query', () => {
      const params = SearchParamsFactories.withSearch('test search');

      expect(params).toEqual({ search: 'test search' });
    });

    it('should create search params with sort options', () => {
      const params = SearchParamsFactories.withSort('handle', 'desc');

      expect(params).toEqual({ sort: 'handle', order: 'desc' });
    });

    it('should create search params with all options', () => {
      const params = SearchParamsFactories.withAll('rouge', 'name', 'asc');

      expect(params).toEqual({
        search: 'rouge',
        sort: 'name',
        order: 'asc',
      });
    });

    it('should convert params to Promise', async () => {
      const params = { search: 'test' };
      const promiseParams = SearchParamsFactories.asPromise(params);

      expect(promiseParams).toBeInstanceOf(Promise);
      const resolved = await promiseParams;
      expect(resolved).toEqual(params);
    });
  });
});