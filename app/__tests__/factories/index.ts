// Re-export commonly used factories with shorter names
export {
  CollectionFactories,
  createMockCollectionsResponse,
} from './shopify-factory';

export {
  createMockEnvironment,
  setupFetchMock,
  APIResponseFactories,
} from './api-factory';

export {
  CollectionsTestFactories,
  CollectionsSSRFactories,
  CollectionsTestData,
  SearchParamsFactories,
} from './collections-factory';