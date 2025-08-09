// Centralized test constants to avoid duplication across API route tests
export const API_TEST_CONFIG = {
  DOMAINS: {
    SHOPIFY_STORE: 'test-store.myshopify.com',
    SHOPIFY_TOKEN: 'test-token',
  },
  HTTP_STATUS: {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
  DEFAULTS: {
    FIRST_PRODUCTS: 12,
    FIRST_COLLECTIONS: 20,
    MAX_PRODUCTS_PER_PAGE: 50,
  },
} as const;

export const TEST_URLS = {
  IMAGES: {
    COLLECTION_1: 'https://example.com/collection1.jpg',
    COLLECTION_2: 'https://example.com/collection2.jpg',
    PRODUCT_1: 'https://example.com/product1.jpg',
    PRODUCT_2: 'https://example.com/product2.jpg',
    PLACEHOLDER: 'https://example.com/placeholder.jpg',
  },
  VIDEOS: {
    WINE_COLLECTION_1: 'https://example.com/wine-video1.mp4',
    WINE_COLLECTION_2: 'https://example.com/wine-video2.mp4',
    GENERIC_FILE: 'https://example.com/generic-video.mp4',
    VIDEO_SOURCE: 'https://example.com/video-source.mp4',
  },
  PREVIEWS: {
    VIDEO_THUMBNAIL: 'https://example.com/video-preview.jpg',
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Network error',
  HTTP_500: 'Erreur HTTP: 500',
  CONNECTION: 'Erreur de connexion',
  GRAPHQL_COLLECTIONS: 'Field "collections" doesn\'t exist on type "QueryRoot"',
} as const;