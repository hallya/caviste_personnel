/**
 * @jest-environment node
 */
import { GET } from "../route";
import { NextRequest } from "next/server";
import { API } from "../../../__tests__/constants";
import { __testHelpers__ } from "@pkg/services-shopify";

const { productDtoFactory, collectionProductsDtoFactory: mockCollectionProductsFragment } = __testHelpers__;

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe("/api/collection-products", () => {
  const mockEnv = {
    SHOPIFY_STORE_DOMAIN: API.DOMAINS.SHOPIFY_STORE,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: API.DOMAINS.SHOPIFY_TOKEN,
    SHOPIFY_API_VERSION: API.DOMAINS.SHOPIFY_API_VERSION,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...process.env, ...mockEnv };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Successful responses", () => {
    it("should fetch collection products successfully", async () => {
      const product = productDtoFactory();
      const mockedCollectionProductsFragment = mockCollectionProductsFragment({
        product,
      });
      const pageInfo = mockedCollectionProductsFragment.products.pageInfo;
      const title = mockedCollectionProductsFragment.title;
      const mockResponse = {
        data: {
          collectionByHandle: mockedCollectionProductsFragment,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const url =
        "http://localhost:3000/api/collection-products?handle=vins-rouges&first=12";
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        title,
        products: [product],
        pageInfo,
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `https://${mockEnv.SHOPIFY_STORE_DOMAIN}/api/${mockEnv.SHOPIFY_API_VERSION}/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token":
              mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          },
          body: expect.stringContaining("collectionByHandle"),
          cache: "no-store",
        }
      );
    });

    it("should handle products without images", async () => {
      const product = productDtoFactory({
        featuredImage: null,
      });
      const mockedCollectionProductsFragment = mockCollectionProductsFragment({
        product,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            collectionByHandle: mockedCollectionProductsFragment,
          },
        }),
      } as Response);

      const url =
        "http://localhost:3000/api/collection-products?handle=test-collection";
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(data.products[0].featuredImage).toBeNull();
    });

    it("should handle products with unavailable variants", async () => {
      const product = productDtoFactory({
        selectedOrFirstAvailableVariant: null,
      });
      const mockedCollectionProductsFragment = mockCollectionProductsFragment({
        product,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            collectionByHandle: mockedCollectionProductsFragment,
          },
        }),
      } as Response);

      const url =
        "http://localhost:3000/api/collection-products?handle=test-collection";
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(data.products[0]).toEqual({
        ...product,
        availableForSale: false,
      });
    });

    it("should handle pagination with after cursor", async () => {
      const mockedCollectionProductsFragment = mockCollectionProductsFragment({
        pageInfo: { hasNextPage: false, endCursor: null },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            collectionByHandle: mockedCollectionProductsFragment,
          },
        }),
      } as Response);

      const url =
        "http://localhost:3000/api/collection-products?handle=test&first=6&after=cursor123";
      const request = new NextRequest(url);
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);

      expect(requestBody.variables).toEqual({
        handle: "test",
        first: 6,
        after: "cursor123",
      });
    });

    it("should ignore null cursor value", async () => {
      const mockedCollectionProductsFragment = mockCollectionProductsFragment();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            collectionByHandle: mockedCollectionProductsFragment,
          },
        }),
      } as Response);

      const url =
        "http://localhost:3000/api/collection-products?handle=test&after=null";
      const request = new NextRequest(url);
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);

      expect(requestBody.variables.after).toBeNull();
    });

    it("should use default first value when not provided", async () => {
      const mockedCollectionProductsFragment = mockCollectionProductsFragment();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            collectionByHandle: mockedCollectionProductsFragment,
          },
        }),
      } as Response);

      const url = "http://localhost:3000/api/collection-products?handle=test";
      const request = new NextRequest(url);
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);

      expect(requestBody.variables.first).toBe(12);
    });
  });

  describe("Error handling", () => {
    it("should return empty response when handle is missing", async () => {
      const url = "http://localhost:3000/api/collection-products";
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        title: null,
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      });

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should handle Shopify API HTTP errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      } as Response);

      const url = "http://localhost:3000/api/collection-products?handle=test";
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        title: null,
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      });
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network timeout"));

      const url = "http://localhost:3000/api/collection-products?handle=test";
      const request = new NextRequest(url);

      await expect(GET(request)).rejects.toThrow("Network timeout");
    });

    it("should handle collection not found", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            collectionByHandle: null,
          },
        }),
      } as Response);

      const url =
        "http://localhost:3000/api/collection-products?handle=nonexistent";
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        title: null,
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      });
    });

    it("should handle missing products in collection", async () => {
      const mockedCollectionProductsFragment = mockCollectionProductsFragment({
        products: {
          __typename: "ProductConnection",
          edges: [],
          pageInfo: {
            __typename: "PageInfo",
            hasNextPage: false,
            endCursor: null,
          },
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            collectionByHandle: mockedCollectionProductsFragment,
          },
        }),
      } as Response);

      const url = "http://localhost:3000/api/collection-products?handle=empty";
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        title: null,
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      });
    });

    it("should handle products without variants", async () => {
      const product = productDtoFactory({
        selectedOrFirstAvailableVariant: null,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            collectionByHandle: mockCollectionProductsFragment({
              product,
            }),
          },
        }),
      } as Response);

      const url = "http://localhost:3000/api/collection-products?handle=test";
      const request = new NextRequest(url);
      const response = await GET(request);
      const data = await response.json();

      expect(data.products[0]).toEqual({
        id: "gid://shopify/Product/333",
        title: "Produit Sans Variant",
        image: null,
        price: null,
        currency: null,
        variantId: null,
        availableForSale: false,
        quantityAvailable: 0,
        tags: ["test"],
      });
    });
  });

  describe("Query parameter handling", () => {
    it("should handle custom first parameter", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            collectionByHandle: mockCollectionProductsFragment(),
          },
        }),
      } as Response);

      const url =
        "http://localhost:3000/api/collection-products?handle=test&first=24";
      const request = new NextRequest(url);
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);

      expect(requestBody.variables.first).toBe(24);
    });

    it("should handle invalid first parameter", async () => {
      const mockResponse = {
        data: {
          collectionByHandle: {
            title: "Test Collection",
            products: {
              edges: [],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const url =
        "http://localhost:3000/api/collection-products?handle=test&first=invalid";
      const request = new NextRequest(url);
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);

      // Number("invalid") returns NaN, but JSON.stringify converts NaN to null
      expect(requestBody.variables.first).toBeNull();
    });
  });
});
