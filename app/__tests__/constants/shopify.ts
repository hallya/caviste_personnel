// Shopify-specific test constants and IDs
export const SHOPIFY_TEST_IDS = {
  COLLECTIONS: {
    VINS_ROUGES: 'gid://shopify/Collection/123',
    VINS_BLANCS: 'gid://shopify/Collection/456',
    SANS_IMAGE: 'gid://shopify/Collection/789',
    SANS_VIDEO: 'gid://shopify/Collection/999',
    MALFORMED_TAGS: 'gid://shopify/Collection/111',
    EMPTY_TAGS: 'gid://shopify/Collection/222',
    GENERIC_FILE: 'gid://shopify/Collection/333',
    VIDEO_SOURCES: 'gid://shopify/Collection/444',
    NO_REFERENCE: 'gid://shopify/Collection/555',
  },
} as const;

export const SHOPIFY_HANDLES = {
  COLLECTIONS: {
    VINS_ROUGES: 'vins-rouges',
    VINS_BLANCS: 'vins-blancs',
    SANS_IMAGE: 'collection-sans-image',
    SANS_VIDEO: 'collection-sans-video',
    MALFORMED: 'collection-malformed',
    EMPTY_TAGS: 'collection-empty-tags',
    GENERIC_FILE: 'collection-generic-file',
    VIDEO_SOURCES: 'collection-video-sources',
    NO_REFERENCE: 'collection-no-reference',
  },
} as const;

export const SHOPIFY_DATA = {
  TAGS: {
    VALID_JSON: '["rouge", "leger", "pour-apero"]',
    BLANC_SEC: '["blanc", "sec"]',
    SINGLE_TAG: '["test"]',
    SANS_VIDEO: '["sans-video"]',
    INVALID_JSON: 'invalid-json-string',
    WITH_SPACES: '["tag1", "  ", "", "tag2", "   tag3   "]',
    WINE_TYPES: ['rouge', 'blanc', 'rosé', 'pétillant'],
    OCCASIONS: ['apéritif', 'repas', 'dessert', 'fête'],
    REGIONS: ['bordeaux', 'bourgogne', 'champagne', 'loire'],
  },
  CURSORS: {
    FIRST_PAGE: 'cursor123',
    SECOND_PAGE: 'cursor456',
    THIRD_PAGE: 'cursor789',
    LAST_PAGE: 'cursor999',
    NULL_STRING: 'null',
  },
} as const;

export const SHOPIFY_MIME_TYPES = {
  VIDEO_MP4: 'video/mp4',
  VIDEO_WEBM: 'video/webm',
  IMAGE_JPEG: 'image/jpeg',
  IMAGE_PNG: 'image/png',
} as const;