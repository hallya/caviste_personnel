import { API_TEST_CONFIG, ERROR_MESSAGES } from '../constants/api';

const createMockResponse = (
  data: unknown,
  status: number = API_TEST_CONFIG.HTTP_STATUS.OK,
  ok: boolean = true
): Response => ({
  ok,
  status,
  statusText: status === API_TEST_CONFIG.HTTP_STATUS.OK ? 'OK' : 'Error',
  json: async () => data,
} as Response);

export const APIResponseFactories = {
  success: (data: unknown) => createMockResponse(data),
  
  error: (status: number = API_TEST_CONFIG.HTTP_STATUS.INTERNAL_SERVER_ERROR) =>
    createMockResponse(
      { error: 'API Error' },
      status,
      false
    ),

  networkError: () => Promise.reject(new Error(ERROR_MESSAGES.NETWORK)),

  graphqlError: (message: string = ERROR_MESSAGES.GRAPHQL_COLLECTIONS) =>
    createMockResponse({
      errors: [
        {
          message,
          locations: [{ line: 2, column: 3 }],
        },
      ],
    }),

  emptyData: () => createMockResponse({ data: null }),

  unauthorizedError: () => createMockResponse(
    { error: 'Unauthorized' },
    API_TEST_CONFIG.HTTP_STATUS.UNAUTHORIZED,
    false
  ),

  notFoundError: () => createMockResponse(
    { error: 'Not Found' },
    API_TEST_CONFIG.HTTP_STATUS.NOT_FOUND,
    false
  ),
};

export const createMockEnvironment = () => ({
  SHOPIFY_STORE_DOMAIN: API_TEST_CONFIG.DOMAINS.SHOPIFY_STORE,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: API_TEST_CONFIG.DOMAINS.SHOPIFY_TOKEN,
});

export const setupFetchMock = (mockFetch: jest.MockedFunction<typeof fetch>) => {
  const mockImplementation = (url: string | URL | Request): Promise<Response> => {
    const urlString = url.toString();
    
    // Default implementations for common endpoints
    if (urlString.includes('/api/collections')) {
      return Promise.resolve(APIResponseFactories.success({ collections: [] }));
    }
    
    if (urlString.includes('/api/collection-products')) {
      return Promise.resolve(APIResponseFactories.success({
        title: null,
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      }));
    }
    
    return Promise.resolve(APIResponseFactories.error());
  };

  mockFetch.mockImplementation(mockImplementation);
  
  return {
    mockSuccess: (data: unknown) => mockFetch.mockResolvedValueOnce(APIResponseFactories.success(data)),
    mockError: (status?: number) => mockFetch.mockResolvedValueOnce(APIResponseFactories.error(status)),
    mockNetworkError: () => mockFetch.mockRejectedValueOnce(new Error(ERROR_MESSAGES.NETWORK)),
    mockGraphqlError: (message?: string) => mockFetch.mockResolvedValueOnce(APIResponseFactories.graphqlError(message)),
  };
};