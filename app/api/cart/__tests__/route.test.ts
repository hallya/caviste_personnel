/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET } from '../route';

process.env.SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com';
process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'test-token';

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

describe('/api/cart (GET)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Parameter validation', () => {
    it('should return 400 when cartId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(data.error).toBe('cartId requis');
    });

    it('should return 500 when environment variables are missing', async () => {
      delete process.env.SHOPIFY_STORE_DOMAIN;
      
      const request = new NextRequest('http://localhost:3000/api/cart?cartId=test-cart');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(data.error).toBe('Configuration Shopify manquante');

      process.env.SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com';
    });
  });

  describe('Cart retrieval', () => {
    const validCartId = 'gid://shopify/Cart/test-cart?key=test-key';

    it('should successfully retrieve cart with products', async () => {
      const mockShopifyResponse = {
        data: {
          cart: {
            id: validCartId,
            totalQuantity: 2,
            checkoutUrl: 'https://checkout.url',
            cost: {
              subtotalAmount: {
                amount: '51.00',
                currencyCode: 'EUR'
              }
            },
            lines: {
              edges: [
                {
                  node: {
                    id: 'gid://shopify/CartLine/line1?cart=test-cart',
                    quantity: 1,
                    merchandise: {
                      id: 'variant-1',
                      title: 'Product 1',
                      price: { amount: '25.50', currencyCode: 'EUR' },
                      availableForSale: true,
                      quantityAvailable: 10,
                      product: {
                        title: 'Product 1',
                        featuredImage: { url: 'https://image1.url' }
                      }
                    }
                  }
                },
                {
                  node: {
                    id: 'gid://shopify/CartLine/line2?cart=test-cart',
                    quantity: 1,
                    merchandise: {
                      id: 'variant-2',
                      title: 'Product 2',
                      price: { amount: '25.50', currencyCode: 'EUR' },
                      availableForSale: true,
                      quantityAvailable: 5,
                      product: {
                        title: 'Product 2',
                        featuredImage: { url: 'https://image2.url' }
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest(`http://localhost:3000/api/cart?cartId=${encodeURIComponent(validCartId)}`);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(data.id).toBe(validCartId);
      expect(data.totalQuantity).toBe(2);
      expect(data.totalAmount).toBe('51.00 EUR');
      expect(data.lines).toHaveLength(2);
      expect(data.lines[0].title).toBe('Product 1');
      expect(data.lines[0].unitPrice).toBe(25.5);
      expect(data.lines[0].lineTotal).toBe('25.50 EUR');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-store.myshopify.com/api/2023-07/graphql.json',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-Shopify-Storefront-Access-Token': 'test-token'
          }),
          body: expect.stringContaining(validCartId)
        })
      );
    });

    it('should return empty cart when cart has no items', async () => {
      const mockShopifyResponse = {
        data: {
          cart: {
            id: validCartId,
            totalQuantity: 0,
            checkoutUrl: 'https://checkout.url',
            cost: {
              subtotalAmount: {
                amount: '0.00',
                currencyCode: 'EUR'
              }
            },
            lines: { edges: [] }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest(`http://localhost:3000/api/cart?cartId=${encodeURIComponent(validCartId)}`);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(data.totalQuantity).toBe(0);
      expect(data.totalAmount).toBe('0.00 EUR');
      expect(data.lines).toEqual([]);
    });

    it('should handle cart not found', async () => {
      const mockShopifyResponse = {
        data: { cart: null }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest(`http://localhost:3000/api/cart?cartId=${encodeURIComponent(validCartId)}`);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(data.error).toBe('Panier non trouvé');
    });

    it('should handle products with null prices', async () => {
      const mockShopifyResponse = {
        data: {
          cart: {
            id: validCartId,
            totalQuantity: 1,
            checkoutUrl: 'https://checkout.url',
            cost: {
              subtotalAmount: {
                amount: '0.00',
                currencyCode: 'EUR'
              }
            },
            lines: {
              edges: [
                {
                  node: {
                    id: 'gid://shopify/CartLine/line1?cart=test-cart',
                    quantity: 1,
                    merchandise: {
                      id: 'variant-1',
                      title: 'Free Product',
                      price: null,
                      availableForSale: true,
                      quantityAvailable: 10,
                      product: {
                        title: 'Free Product',
                        featuredImage: null
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest(`http://localhost:3000/api/cart?cartId=${encodeURIComponent(validCartId)}`);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(data.lines[0].unitPrice).toBe(0);
      expect(data.lines[0].price).toBe('Prix non disponible');
      expect(data.lines[0].lineTotal).toBe('0.00 EUR');
    });

    it('should handle Shopify API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      } as Response);

      const request = new NextRequest(`http://localhost:3000/api/cart?cartId=${encodeURIComponent(validCartId)}`);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(data.error).toBe('Erreur Shopify');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = new NextRequest(`http://localhost:3000/api/cart?cartId=${encodeURIComponent(validCartId)}`);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(data.error).toBe('Erreur de connexion');
    });
  });

  describe('GraphQL query structure', () => {
    it('should use correct GraphQL query with proper cart ID', async () => {
      const mockShopifyResponse = {
        data: {
          cart: {
            id: 'test-cart',
            totalQuantity: 0,
            lines: { edges: [] }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const cartId = 'gid://shopify/Cart/test-cart?key=test-key';
      const request = new NextRequest(`http://localhost:3000/api/cart?cartId=${encodeURIComponent(cartId)}`);

      await GET(request);

      const callBody = mockFetch.mock.calls[0][1]?.body as string;
      const parsedBody = JSON.parse(callBody);
      
      expect(parsedBody.query).toContain('query getCart($cartId: ID!)');
      expect(parsedBody.variables.cartId).toBe(cartId);
    });

    it('should include first parameter in lines query', async () => {
      const mockShopifyResponse = {
        data: {
          cart: {
            id: 'test-cart',
            totalQuantity: 0,
            lines: { edges: [] }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/cart?cartId=test-cart');

      await GET(request);

      const callBody = mockFetch.mock.calls[0][1]?.body as string;
      const parsedBody = JSON.parse(callBody);
      
      expect(parsedBody.query).toContain('lines(first: 100)');
    });
  });

  describe('Response formatting', () => {
    it('should format line totals correctly', async () => {
      const mockShopifyResponse = {
        data: {
          cart: {
            id: 'test-cart',
            totalQuantity: 3,
            checkoutUrl: 'https://checkout.url',
            cost: {
              subtotalAmount: {
                amount: '76.50',
                currencyCode: 'EUR'
              }
            },
            lines: {
              edges: [
                {
                  node: {
                    id: 'line1',
                    quantity: 3,
                    merchandise: {
                      price: { amount: '25.50', currencyCode: 'EUR' },
                      product: { title: 'Test Product' }
                    }
                  }
                }
              ]
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/cart?cartId=test-cart');

      const response = await GET(request);
      const data = await response.json();

      expect(data.lines[0].lineTotal).toBe('76.50 EUR');
      expect(data.totalAmount).toBe('76.50 EUR');
    });
  });
});