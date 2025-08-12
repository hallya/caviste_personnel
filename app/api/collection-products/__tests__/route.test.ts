/**
 * @jest-environment node
 */
import { GET } from '../route';
import { NextRequest } from 'next/server';
import type { ShopifyProduct } from '../../../types/shopify';
import { API } from '../../../__tests__/constants';

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('/api/collection-products', () => {
  const mockEnv = {
    SHOPIFY_STORE_DOMAIN: API.DOMAINS.SHOPIFY_STORE,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: API.DOMAINS.SHOPIFY_TOKEN
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...process.env, ...mockEnv };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful responses', () => {
    it('should fetch collection products successfully', async () => {
      const mockProduct: ShopifyProduct = {
        id: 'gid://shopify/Product/123',
        title: 'Château Test 2020',
        handle: 'chateau-test-2020',
        featuredImage: { 
          id: 'img1',
          url: 'https://example.com/product.jpg' 
        },
        tags: ['rouge', 'bordeaux', 'premium'],
        priceRange: {
          minVariantPrice: {
            amount: '25.99',
            currencyCode: 'EUR'
          }
        },
        selectedOrFirstAvailableVariant: {
          id: 'gid://shopify/ProductVariant/456',
          price: {
            amount: '25.99',
            currencyCode: 'EUR'
          },
          availableForSale: true,
          quantityAvailable: 10
        },
        images: { edges: [] },
        variants: { edges: [] },
        availableForSale: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      const mockResponse = {
        data: {
          collectionByHandle: {
            title: 'Vins Rouges',
            products: {
              edges: [
                {
                  cursor: 'cursor123',
                  node: mockProduct
                }
              ],
              pageInfo: {
                hasNextPage: true,
                endCursor: 'cursor123'
              }
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=vins-rouges&first=12';
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        title: 'Vins Rouges',
        products: [
          {
            id: 'gid://shopify/Product/123',
            title: 'Château Test 2020',
            image: 'https://example.com/product.jpg',
            price: '25.99',
            currency: 'EUR',
            variantId: 'gid://shopify/ProductVariant/456',
            availableForSale: true,
            quantityAvailable: 10,
            tags: ['rouge', 'bordeaux', 'premium']
          }
        ],
        pageInfo: {
          hasNextPage: true,
          endCursor: 'cursor123'
        }
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://${mockEnv.SHOPIFY_STORE_DOMAIN}/api/2023-07/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN
          },
          body: expect.stringContaining('collectionByHandle'),
          cache: 'no-store'
        }
      );
    });

    it('should handle products without images', async () => {
      const mockProduct: ShopifyProduct = {
        id: 'gid://shopify/Product/789',
        title: 'Produit Sans Image',
        handle: 'produit-sans-image',
        tags: ['test'],
        priceRange: {
          minVariantPrice: {
            amount: '15.99',
            currencyCode: 'EUR'
          }
        },
        selectedOrFirstAvailableVariant: {
          id: 'gid://shopify/ProductVariant/999',
          price: {
            amount: '15.99',
            currencyCode: 'EUR'
          },
          availableForSale: true,
          quantityAvailable: 5
        },
        images: { edges: [] },
        variants: { edges: [] },
        availableForSale: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      const mockResponse = {
        data: {
          collectionByHandle: {
            title: 'Test Collection',
            products: {
              edges: [{ cursor: 'cursor789', node: mockProduct }],
              pageInfo: { hasNextPage: false, endCursor: null }
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=test-collection';
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(data.products[0].image).toBeNull();
    });

    it('should handle products with unavailable variants', async () => {
      const mockProduct: ShopifyProduct = {
        id: 'gid://shopify/Product/111',
        title: 'Produit Indisponible',
        handle: 'produit-indisponible',
        tags: ['test'],
        priceRange: {
          minVariantPrice: {
            amount: '20.99',
            currencyCode: 'EUR'
          }
        },
        selectedOrFirstAvailableVariant: {
          id: 'gid://shopify/ProductVariant/222',
          price: {
            amount: '20.99',
            currencyCode: 'EUR'
          },
          availableForSale: false,
          quantityAvailable: 0
        },
        images: { edges: [] },
        variants: { edges: [] },
        availableForSale: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      const mockResponse = {
        data: {
          collectionByHandle: {
            title: 'Test Collection',
            products: {
              edges: [{ cursor: 'cursor111', node: mockProduct }],
              pageInfo: { hasNextPage: false, endCursor: null }
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=test-collection';
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(data.products[0]).toEqual({
        id: 'gid://shopify/Product/111',
        title: 'Produit Indisponible',
        image: null,
        price: '20.99',
        currency: 'EUR',
        variantId: null, // Should be null when not available for sale
        availableForSale: false,
        quantityAvailable: 0,
        tags: ['test']
      });
    });

    it('should handle pagination with after cursor', async () => {
      const mockResponse = {
        data: {
          collectionByHandle: {
            title: 'Paginated Collection',
            products: {
              edges: [],
              pageInfo: { hasNextPage: false, endCursor: null }
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=test&first=6&after=cursor123';
      const request = new NextRequest(url);
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);
      
      expect(requestBody.variables).toEqual({
        handle: 'test',
        first: 6,
        after: 'cursor123'
      });
    });

    it('should ignore null cursor value', async () => {
      const mockResponse = {
        data: {
          collectionByHandle: {
            title: 'Test Collection',
            products: {
              edges: [],
              pageInfo: { hasNextPage: false, endCursor: null }
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=test&after=null';
      const request = new NextRequest(url);
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);
      
      expect(requestBody.variables.after).toBeNull();
    });

    it('should use default first value when not provided', async () => {
      const mockResponse = {
        data: {
          collectionByHandle: {
            title: 'Test Collection',
            products: {
              edges: [],
              pageInfo: { hasNextPage: false, endCursor: null }
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=test';
      const request = new NextRequest(url);
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);
      
      expect(requestBody.variables.first).toBe(12);
    });
  });

  describe('Error handling', () => {
    it('should return empty response when handle is missing', async () => {
      const url = 'http://localhost:3000/api/collection-products';
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        title: null,
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null }
      });

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle Shopify API HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=test';
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        title: null,
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null }
      });
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

      const url = 'http://localhost:3000/api/collection-products?handle=test';
      const request = new NextRequest(url);
      
      await expect(GET(request)).rejects.toThrow('Network timeout');
    });

    it('should handle collection not found', async () => {
      const mockResponse = {
        data: {
          collectionByHandle: null
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=nonexistent';
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        title: null,
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null }
      });
    });

    it('should handle missing products in collection', async () => {
      const mockResponse = {
        data: {
          collectionByHandle: {
            title: 'Empty Collection',
            products: null
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=empty';
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        title: 'Empty Collection',
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null }
      });
    });

    it('should handle products without variants', async () => {
      const mockProduct: Partial<ShopifyProduct> = {
        id: 'gid://shopify/Product/333',
        title: 'Produit Sans Variant',
        tags: ['test']
      };

      const mockResponse = {
        data: {
          collectionByHandle: {
            title: 'Test Collection',
            products: {
              edges: [{ cursor: 'cursor333', node: mockProduct }],
              pageInfo: { hasNextPage: false, endCursor: null }
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=test';
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(data.products[0]).toEqual({
        id: 'gid://shopify/Product/333',
        title: 'Produit Sans Variant',
        image: null,
        price: null,
        currency: null,
        variantId: null,
        availableForSale: false,
        quantityAvailable: 0,
        tags: ['test']
      });
    });
  });

  describe('Query parameter handling', () => {
    it('should handle custom first parameter', async () => {
      const mockResponse = {
        data: {
          collectionByHandle: {
            title: 'Test Collection',
            products: {
              edges: [],
              pageInfo: { hasNextPage: false, endCursor: null }
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=test&first=24';
      const request = new NextRequest(url);
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);
      
      expect(requestBody.variables.first).toBe(24);
    });

    it('should handle invalid first parameter', async () => {
      const mockResponse = {
        data: {
          collectionByHandle: {
            title: 'Test Collection',
            products: {
              edges: [],
              pageInfo: { hasNextPage: false, endCursor: null }
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const url = 'http://localhost:3000/api/collection-products?handle=test&first=invalid';
      const request = new NextRequest(url);
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);
      
      // Number("invalid") returns NaN, but JSON.stringify converts NaN to null
      expect(requestBody.variables.first).toBeNull();
    });
  });
});