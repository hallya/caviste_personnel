/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '../route';

process.env.SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com';
process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'test-token';

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

describe('/api/cart/remove', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Parameter validation', () => {
    it('should return 400 when cartId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ lineId: 'test-line-id' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(data.error).toBe('cartId et lineId requis');
    });

    it('should return 400 when lineId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ cartId: 'test-cart-id' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(data.error).toBe('cartId et lineId requis');
    });

    it('should return 500 when environment variables are missing', async () => {
      delete process.env.SHOPIFY_STORE_DOMAIN;
      
      const request = new NextRequest('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ 
          cartId: 'test-cart-id', 
          lineId: 'test-line-id' 
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(data.error).toBe('Configuration Shopify manquante');


      process.env.SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com';
    });
  });

  describe('Shopify API interaction', () => {
    const validCartId = 'gid://shopify/Cart/test-cart?key=test-key';
    const validLineId = 'gid://shopify/CartLine/test-line?cart=test-cart';

    it('should successfully remove item from cart', async () => {
      const mockShopifyResponse = {
        data: {
          cartLinesRemove: {
            cart: {
              id: validCartId,
              totalQuantity: 1,
              checkoutUrl: 'https://checkout.url',
              cost: {
                subtotalAmount: {
                  amount: '25.50',
                  currencyCode: 'EUR'
                }
              },
              lines: {
                edges: [
                  {
                    node: {
                      id: 'remaining-line-id',
                      quantity: 1,
                      merchandise: {
                        id: 'variant-id',
                        title: 'Test Product',
                        price: { amount: '25.50', currencyCode: 'EUR' },
                        availableForSale: true,
                        quantityAvailable: 5,
                        product: {
                          title: 'Test Product',
                          featuredImage: { url: 'https://image.url' }
                        }
                      }
                    }
                  }
                ]
              }
            },
            userErrors: []
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ cartId: validCartId, lineId: validLineId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(data.id).toBe(validCartId);
      expect(data.totalQuantity).toBe(1);
      expect(data.lines).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-store.myshopify.com/api/2023-07/graphql.json',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-Shopify-Storefront-Access-Token': 'test-token'
          }),
          body: expect.stringContaining(validLineId)
        })
      );
    });

    it('should return empty cart when last item is removed', async () => {
      const mockShopifyResponse = {
        data: {
          cartLinesRemove: {
            cart: null,
            userErrors: []
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ cartId: validCartId, lineId: validLineId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(data.id).toBeNull();
      expect(data.totalQuantity).toBe(0);
      expect(data.totalAmount).toBe('0.00 EUR');
      expect(data.lines).toEqual([]);
      expect(data.message).toBe('Produit supprimé avec succès');
    });

    it('should handle Shopify user errors', async () => {
      const mockShopifyResponse = {
        data: {
          cartLinesRemove: {
            cart: null,
            userErrors: [
              {
                field: ['lineIds', '0'],
                message: 'The merchandise line with id test-line does not exist.'
              }
            ]
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ cartId: validCartId, lineId: validLineId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(data.error).toBe('The merchandise line with id test-line does not exist.');
    });

    it('should handle GraphQL errors with RESOURCE_NOT_FOUND', async () => {
      const mockShopifyResponse = {
        data: {
          cartLinesRemove: {
            cart: null,
            userErrors: []
          }
        },
        errors: [
          {
            message: 'Invalid id: gid://shopify/CartLine/test-line',
            extensions: { code: 'RESOURCE_NOT_FOUND' }
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ cartId: validCartId, lineId: validLineId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.CONFLICT);
      expect(data.error).toBe('Article déjà supprimé ou panier modifié par une autre session');
    });

    it('should handle Shopify API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ cartId: validCartId, lineId: validLineId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(data.error).toBe('Erreur Shopify');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ cartId: validCartId, lineId: validLineId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(data.error).toBe('Erreur de connexion');
    });
  });

  describe('GraphQL Query Structure', () => {
    it('should use correct GraphQL mutation with proper lineId format', async () => {
      const mockShopifyResponse = {
        data: {
          cartLinesRemove: {
            cart: null,
            userErrors: []
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const fullLineId = 'gid://shopify/CartLine/test-line?cart=test-cart';
      const request = new NextRequest('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ 
          cartId: 'gid://shopify/Cart/test-cart?key=test-key', 
          lineId: fullLineId 
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      await POST(request);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"lineIds":["' + fullLineId + '"]')
        })
      );
    });

    it('should include first parameter in lines query', async () => {
      const mockShopifyResponse = {
        data: {
          cartLinesRemove: {
            cart: {
              id: 'test-cart',
              totalQuantity: 0,
              lines: { edges: [] }
            },
            userErrors: []
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ 
          cartId: 'test-cart', 
          lineId: 'test-line' 
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      await POST(request);

      const callBody = mockFetch.mock.calls[0][1]?.body as string;
      const parsedBody = JSON.parse(callBody);
      
      expect(parsedBody.query).toContain('lines(first: 50)');
    });
  });
});