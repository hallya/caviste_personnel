/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { POST } from "../route";

process.env.SHOPIFY_STORE_DOMAIN = "test-store.myshopify.com";
process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "test-token";

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

describe("/api/cart/add", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Parameter validation", () => {
    it("should return 400 when variantId is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/cart/add", {
        method: "POST",
        body: JSON.stringify({ quantity: 1 }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(data.error).toBe("variantId manquant");
    });
  });

  describe("Cart operations", () => {
    it("should handle successful cart creation", async () => {
      const mockShopifyResponse = {
        data: {
          cartCreate: {
            cart: {
              id: "gid://shopify/Cart/new-cart?key=new-key",
              totalQuantity: 1,
              checkoutUrl: "https://checkout.url",
            },
            userErrors: [],
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse,
      } as Response);

      const request = new NextRequest("http://localhost:3000/api/cart/add", {
        method: "POST",
        body: JSON.stringify({ variantId: "test-variant", quantity: 1 }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(data.cartId).toBe("gid://shopify/Cart/new-cart?key=new-key");
      expect(data.totalQuantity).toBe(1);
    });

    it("should handle Shopify user errors", async () => {
      const mockShopifyResponse = {
        data: {
          cartCreate: {
            cart: null,
            userErrors: [
              {
                field: ["lines", "0", "merchandiseId"],
                message: "The merchandise does not exist.",
              },
            ],
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShopifyResponse,
      } as Response);

      const request = new NextRequest("http://localhost:3000/api/cart/add", {
        method: "POST",
        body: JSON.stringify({ variantId: "invalid-variant", quantity: 1 }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(data.error).toBe("The merchandise does not exist.");
    });
  });
});
