// Factory functions to generate consistent test data and reduce duplication
import type {
  ShopifyCollectionsGraphQLResponse,
  ShopifyCollectionGraphQLNode,
  ShopifyMetafieldReference,
} from '../../types/shopify';
import { SHOPIFY_TEST_IDS, SHOPIFY_HANDLES, SHOPIFY_DATA, SHOPIFY_MIME_TYPES } from '../constants/shopify';
import { TEST_URLS } from '../constants/api';

interface CollectionFactoryOptions {
  id?: string;
  title?: string;
  handle?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  videoType?: 'GenericFile' | 'Video' | null;
  tagsJson?: string;
}

const createMockCollection = (options: CollectionFactoryOptions = {}): ShopifyCollectionGraphQLNode => {
  const {
    id = SHOPIFY_TEST_IDS.COLLECTIONS.VINS_ROUGES,
    title = 'Collection Test',
    handle = SHOPIFY_HANDLES.COLLECTIONS.VINS_ROUGES,
    imageUrl = TEST_URLS.IMAGES.COLLECTION_1,
    videoUrl = TEST_URLS.VIDEOS.WINE_COLLECTION_1,
    videoType = 'GenericFile',
    tagsJson = SHOPIFY_DATA.TAGS.VALID_JSON,
  } = options;

  const collection: ShopifyCollectionGraphQLNode = {
    id,
    title,
    handle,
  };

  if (imageUrl) {
    collection.image = { url: imageUrl };
  }
  if (videoUrl && videoType) {
    const reference: ShopifyMetafieldReference = {
      __typename: videoType,
      url: videoUrl,
      mimeType: SHOPIFY_MIME_TYPES.VIDEO_MP4,
    };

    if (videoType === 'Video') {
      reference.sources = [
        {
          url: videoUrl,
          mimeType: SHOPIFY_MIME_TYPES.VIDEO_MP4,
          format: 'mp4',
        },
      ];
      reference.previewImage = { url: TEST_URLS.PREVIEWS.VIDEO_THUMBNAIL };
    }

    collection.metafield = {
      type: 'file_reference',
      reference,
    };
  }

  collection.tagsMetafield = {
    type: 'list.single_line_text_field',
    value: tagsJson,
  };

  return collection;
};

export const createMockCollectionsResponse = (
  collections: ShopifyCollectionGraphQLNode[]
): ShopifyCollectionsGraphQLResponse => ({
  data: {
    collections: {
      edges: collections.map(node => ({ node })),
    },
  },
});

export const CollectionFactories = {
  wineCollection: (overrides: Partial<CollectionFactoryOptions> = {}) =>
    createMockCollection({
      id: SHOPIFY_TEST_IDS.COLLECTIONS.VINS_ROUGES,
      title: 'Vins Rouges',
      handle: SHOPIFY_HANDLES.COLLECTIONS.VINS_ROUGES,
      tagsJson: SHOPIFY_DATA.TAGS.VALID_JSON,
      ...overrides,
    }),

  collectionWithoutImage: (overrides: Partial<CollectionFactoryOptions> = {}) =>
    createMockCollection({
      id: SHOPIFY_TEST_IDS.COLLECTIONS.SANS_IMAGE,
      title: 'Collection Sans Image',
      handle: SHOPIFY_HANDLES.COLLECTIONS.SANS_IMAGE,
      imageUrl: null,
      ...overrides,
    }),

  collectionWithoutVideo: (overrides: Partial<CollectionFactoryOptions> = {}) =>
    createMockCollection({
      id: SHOPIFY_TEST_IDS.COLLECTIONS.SANS_VIDEO,
      title: 'Collection Sans Vidéo',
      handle: SHOPIFY_HANDLES.COLLECTIONS.SANS_VIDEO,
      videoUrl: null,
      videoType: null,
      ...overrides,
    }),

  collectionWithMalformedTags: (overrides: Partial<CollectionFactoryOptions> = {}) =>
    createMockCollection({
      id: SHOPIFY_TEST_IDS.COLLECTIONS.MALFORMED_TAGS,
      title: 'Collection Malformed Tags',
      handle: SHOPIFY_HANDLES.COLLECTIONS.MALFORMED,
      tagsJson: SHOPIFY_DATA.TAGS.INVALID_JSON,
      ...overrides,
    }),
};