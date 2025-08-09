/**
 * @jest-environment node
 */
import { GET } from '../route';
import { NextRequest } from 'next/server';
import type { ShopifyCollectionsGraphQLResponse } from '../../../types/shopify';
import {
  API,
  IDS,
  HANDLES,
  DATA,
  URLS,
  ERRORS,
} from '../../../__tests__/constants';
import {
  CollectionFactories,
  createMockCollectionsResponse,
  createMockEnvironment,
  setupFetchMock,
  APIResponseFactories,
} from '../../../__tests__/factories';

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('/api/collections', () => {
  const mockEnv = createMockEnvironment();
  let fetchMock: ReturnType<typeof setupFetchMock>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...process.env, ...mockEnv };
    fetchMock = setupFetchMock(mockFetch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful responses', () => {
    it('should fetch and transform collections successfully', async () => {
      const collections = [
        CollectionFactories.wineCollection({
          id: IDS.COLLECTIONS.VINS_ROUGES,
          title: 'Vins Rouges',
          handle: HANDLES.COLLECTIONS.VINS_ROUGES,
          tagsJson: DATA.TAGS.VALID_JSON,
        }),
        CollectionFactories.wineCollection({
          id: IDS.COLLECTIONS.VINS_BLANCS,
          title: 'Vins Blancs',
          handle: HANDLES.COLLECTIONS.VINS_BLANCS,
          videoType: 'Video',
          tagsJson: DATA.TAGS.BLANC_SEC,
        }),
      ];

      const mockCollectionsResponse = createMockCollectionsResponse(collections);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCollectionsResponse,
        status: 200,
        statusText: 'OK'
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        collections: [
          {
            id: IDS.COLLECTIONS.VINS_ROUGES,
            title: 'Vins Rouges',
            handle: HANDLES.COLLECTIONS.VINS_ROUGES,
            image: URLS.IMAGES.COLLECTION_1,
            videoCollection: URLS.VIDEOS.WINE_COLLECTION_1,
            collectionTags: ['rouge', 'leger', 'pour-apero']
          },
          {
            id: IDS.COLLECTIONS.VINS_BLANCS,
            title: 'Vins Blancs',
            handle: HANDLES.COLLECTIONS.VINS_BLANCS,
            image: URLS.IMAGES.COLLECTION_1,
            videoCollection: URLS.VIDEOS.WINE_COLLECTION_1,
            collectionTags: ['blanc', 'sec']
          }
        ]
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://${mockEnv.SHOPIFY_STORE_DOMAIN}/api/2023-07/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN
          },
          body: expect.stringContaining('collections(first: 20)'),
          cache: 'no-store'
        }
      );
    });

    it('should handle collections without images', async () => {
      const mockResponse: ShopifyCollectionsGraphQLResponse = {
        data: {
          collections: {
            edges: [
              {
                node: {
                  id: 'gid://shopify/Collection/789',
                  title: 'Collection Sans Image',
                  handle: 'collection-sans-image',
                  tagsMetafield: {
                    type: 'list.single_line_text_field',
                    value: '["test"]'
                  }
                }
              }
            ]
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(data.collections[0]).toEqual({
        id: 'gid://shopify/Collection/789',
        title: 'Collection Sans Image',
        handle: 'collection-sans-image',
        image: null,
        videoCollection: null,
        collectionTags: ['test']
      });
    });

    it('should handle collections without video metafields', async () => {
      const mockResponse: ShopifyCollectionsGraphQLResponse = {
        data: {
          collections: {
            edges: [
              {
                node: {
                  id: 'gid://shopify/Collection/999',
                  title: 'Collection Sans Video',
                  handle: 'collection-sans-video',
                  image: { url: 'https://example.com/image.jpg' },
                  tagsMetafield: {
                    type: 'list.single_line_text_field',
                    value: '["sans-video"]'
                  }
                }
              }
            ]
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(data.collections[0].videoCollection).toBeNull();
    });

    it('should handle malformed collection tags gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const mockResponse: ShopifyCollectionsGraphQLResponse = {
        data: {
          collections: {
            edges: [
              {
                node: {
                  id: 'gid://shopify/Collection/111',
                  title: 'Collection Malformed Tags',
                  handle: 'collection-malformed',
                  tagsMetafield: {
                    type: 'list.single_line_text_field',
                    value: 'invalid-json-string'
                  }
                }
              }
            ]
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(data.collections[0].collectionTags).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to parse collection tags for collection-malformed'),
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should filter out empty tags', async () => {
      const mockResponse: ShopifyCollectionsGraphQLResponse = {
        data: {
          collections: {
            edges: [
              {
                node: {
                  id: 'gid://shopify/Collection/222',
                  title: 'Collection Empty Tags',
                  handle: 'collection-empty-tags',
                  tagsMetafield: {
                    type: 'list.single_line_text_field',
                    value: '["tag1", "  ", "", "tag2", "   tag3   "]'
                  }
                }
              }
            ]
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(data.collections[0].collectionTags).toEqual(['tag1', 'tag2', 'tag3']);
    });
  });

  describe('Error handling', () => {
    it('should handle Shopify API HTTP errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ collections: [] });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Shopify API error:',
        500,
        'Internal Server Error'
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle GraphQL errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockErrorResponse = {
        errors: [
          {
            message: 'Field "collections" doesn\'t exist on type "QueryRoot"',
            locations: [{ line: 2, column: 3 }]
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ collections: [] });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'GraphQL errors:',
        expect.stringContaining('"Field \\"collections\\" doesn\'t exist on type \\"QueryRoot\\""')
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/collections');
      
      await expect(GET(request)).rejects.toThrow('Network error');
    });

    it('should handle empty response data', async () => {
      const mockResponse = {
        data: null
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ collections: [] });
    });

    it('should handle missing collections in response', async () => {
      const mockResponse = {
        data: {
          collections: null
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ collections: [] });
    });
  });

  describe('Video metafield handling', () => {
    it('should handle GenericFile video metafield', async () => {
      const mockResponse: ShopifyCollectionsGraphQLResponse = {
        data: {
          collections: {
            edges: [
              {
                node: {
                  id: 'gid://shopify/Collection/333',
                  title: 'Collection GenericFile',
                  handle: 'collection-generic-file',
                  metafield: {
                    type: 'file_reference',
                    reference: {
                      __typename: 'GenericFile',
                      url: 'https://example.com/generic-video.mp4',
                      mimeType: 'video/mp4'
                    }
                  }
                }
              }
            ]
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(data.collections[0].videoCollection).toBe('https://example.com/generic-video.mp4');
    });

    it('should handle Video metafield with sources', async () => {
      const mockResponse: ShopifyCollectionsGraphQLResponse = {
        data: {
          collections: {
            edges: [
              {
                node: {
                  id: 'gid://shopify/Collection/444',
                  title: 'Collection Video Sources',
                  handle: 'collection-video-sources',
                  metafield: {
                    type: 'file_reference',
                    reference: {
                      __typename: 'Video',
                      sources: [
                        {
                          url: 'https://example.com/video-source.mp4',
                          mimeType: 'video/mp4',
                          format: 'mp4'
                        }
                      ],
                      previewImage: { url: 'https://example.com/preview.jpg' }
                    }
                  }
                }
              }
            ]
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(data.collections[0].videoCollection).toBe('https://example.com/video-source.mp4');
    });

    it('should handle metafield without reference', async () => {
      const mockResponse: ShopifyCollectionsGraphQLResponse = {
        data: {
          collections: {
            edges: [
              {
                node: {
                  id: 'gid://shopify/Collection/555',
                  title: 'Collection No Reference',
                  handle: 'collection-no-reference',
                  metafield: {
                    type: 'file_reference'
                  }
                }
              }
            ]
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/collections');
      const response = await GET(request);
      const data = await response.json();

      expect(data.collections[0].videoCollection).toBeNull();
    });
  });
});