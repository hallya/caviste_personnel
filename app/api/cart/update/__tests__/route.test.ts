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
  INTERNAL_SERVER_ERROR: 500,
} as const;

describe('/api/cart/update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Parameter validation', () => {
    it('should return 400 when cartId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ lineId: 'test-line', quantity: 2 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(data.error).toBe('cartId, lineId et quantity requis');
    });

    it('should return 400 when lineId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ cartId: 'test-cart', quantity: 2 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(data.error).toBe('cartId, lineId et quantity requis');
    });

    it('should return 400 when quantity is undefined', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ cartId: 'test-cart', lineId: 'test-line' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(data.error).toBe('cartId, lineId et quantity requis');
    });

    it('should return 400 when quantity is negative', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ cartId: 'test-cart', lineId: 'test-line', quantity: -1 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(data.error).toBe('Quantité invalide');
    });

    it('should accept quantity 0 for removal', async () => {
      const mockShopifyResponse = {
        data: {
          cartLinesUpdate: {
            cart: {
              id: 'test-cart',
              totalQuantity: 0,
              checkoutUrl: 'https://checkout.url',
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

      const request = new NextRequest('http://localhost:3000/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ cartId: 'test-cart', lineId: 'test-line', quantity: 0 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(HTTP_STATUS.OK);
    });
  });

  describe('Shopify API interaction', () => {
    const validCartId = 'gid://shopify/Cart/test-cart?key=test-key';
    const validLineId = 'gid://shopify/CartLine/test-line?cart=test-cart';

    it('should successfully update item quantity', async () => {
      const mockShopifyResponse = {
        data: {
          cartLinesUpdate: {
            cart: {
              id: validCartId,
              totalQuantity: 3,
              checkoutUrl: 'https://checkout.url',
              lines: {
                edges: [
                  {
                    node: {
                      id: validLineId,
                      quantity: 3,
                      merchandise: {
                        id: 'variant-id',
                        title: 'Test Product',
                        price: { amount: '25.50', currencyCode: 'EUR' },
                        availableForSale: true,
                        quantityAvailable: 10,
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

      const request = new NextRequest('http://localhost:3000/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ cartId: validCartId, lineId: validLineId, quantity: 3 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(data.id).toBe(validCartId);
      expect(data.totalQuantity).toBe(3);
      expect(data.lines).toHaveLength(1);
      expect(data.lines[0].quantity).toBe(3);
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

    it('should handle Shopify user errors', async () => {
      const mockShopifyResponse = {
        data: {
          cartLinesUpdate: {
            cart: null,
            userErrors: [
              {
                field: ['lines', '0', 'id'],
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

      const request = new NextRequest('http://localhost:3000/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ cartId: validCartId, lineId: validLineId, quantity: 2 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(data.error).toBe('The merchandise line with id test-line does not exist.');
    });

    it('should handle Shopify API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ cartId: validCartId, lineId: validLineId, quantity: 2 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(data.error).toBe('Erreur Shopify');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ cartId: validCartId, lineId: validLineId, quantity: 2 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(data.error).toBe('Erreur de connexion');
    });
  });

  describe('GraphQL mutation structure', () => {
    it('should use correct GraphQL mutation with proper parameters', async () => {
      const mockShopifyResponse = {
        data: {
          cartLinesUpdate: {
            cart: { id: 'test-cart', totalQuantity: 2, lines: { edges: [] } },
            userErrors: []
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const cartId = 'gid://shopify/Cart/test-cart?key=test-key';
      const lineId = 'gid://shopify/CartLine/test-line?cart=test-cart';
      const quantity = 4;

      const request = new NextRequest('http://localhost:3000/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ cartId, lineId, quantity }),
        headers: { 'Content-Type': 'application/json' },
      });

      await POST(request);

      const callBody = mockFetch.mock.calls[0][1]?.body as string;
      const parsedBody = JSON.parse(callBody);
      
      expect(parsedBody.query).toContain('cartLinesUpdate');
      expect(parsedBody.variables.cartId).toBe(cartId);
      expect(parsedBody.variables.lines[0].id).toBe(lineId);
      expect(parsedBody.variables.lines[0].quantity).toBe(quantity);
    });

    it('should include first parameter in lines query', async () => {
      const mockShopifyResponse = {
        data: {
          cartLinesUpdate: {
            cart: { id: 'test-cart', totalQuantity: 1, lines: { edges: [] } },
            userErrors: []
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ cartId: 'test-cart', lineId: 'test-line', quantity: 1 }),
        headers: { 'Content-Type': 'application/json' },
      });

      await POST(request);

      const callBody = mockFetch.mock.calls[0][1]?.body as string;
      const parsedBody = JSON.parse(callBody);
      
      expect(parsedBody.query).toContain('lines(first: 50)');
    });
  });
});