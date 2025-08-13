/**
 * @jest-environment jsdom
 */
import { CollectionsApi } from "../CollectionsApi";
import { CollectionsSSRFactories } from "../../../__tests__/factories";

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

const originalEnv = process.env;

describe("CollectionsApi", () => {
  let collectionsApi: CollectionsApi;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env = {
      ...originalEnv,
      SHOPIFY_STORE_DOMAIN: "test-store.myshopify.com",
      SHOPIFY_STOREFRONT_ACCESS_TOKEN: "test-token",
      SHOPIFY_API_VERSION: "2023-07",
    };

    collectionsApi = new CollectionsApi();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("fetchCollections", () => {
    it("should fetch and transform collections successfully", async () => {
      const mockResponse = CollectionsSSRFactories.mockShopifyResponse();

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const collections = await collectionsApi.fetchCollections();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/2023-07/graphql.json"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": expect.any(String),
          },
          body: expect.stringContaining("collections(first: 20)"),
        })
      );

      expect(collections).toHaveLength(2);
      expect(collections[0]).toEqual({
        id: expect.any(String),
        title: "Vins Rouges",
        handle: "vins-rouges",
        image: expect.any(String),
        videoCollection: expect.any(String),
        collectionTags: ["rouge", "leger", "pour-apero"],
      });
    });

    it("should handle API errors gracefully", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      const collections = await collectionsApi.fetchCollections();

      expect(collections).toEqual([]);
    });

    it("should handle GraphQL errors gracefully", async () => {
      const mockResponse = {
        errors: [{ message: "GraphQL error" }],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const collections = await collectionsApi.fetchCollections();

      expect(collections).toEqual([]);
    });

    it("should handle network errors gracefully", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const collections = await collectionsApi.fetchCollections();

      expect(collections).toEqual([]);
    });

    it("should handle empty collections response", async () => {
      const mockResponse = CollectionsSSRFactories.emptyShopifyResponse();

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const collections = await collectionsApi.fetchCollections();

      expect(collections).toEqual([]);
    });

    it("should parse collection tags correctly", async () => {
      const mockResponse = {
        data: {
          collections: {
            edges: [
              {
                node: {
                  id: "gid://shopify/Collection/1",
                  title: "Test Collection",
                  handle: "test-collection",
                  image: { url: "https://example.com/image.jpg" },
                  metafield: null,
                  tagsMetafield: {
                    value: '["tag1", "tag2", "tag3"]',
                  },
                },
              },
            ],
          },
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const collections = await collectionsApi.fetchCollections();

      expect(collections[0].collectionTags).toEqual(["tag1", "tag2", "tag3"]);
    });

    it("should handle invalid collection tags gracefully", async () => {
      const mockResponse = {
        data: {
          collections: {
            edges: [
              {
                node: {
                  id: "gid://shopify/Collection/1",
                  title: "Test Collection",
                  handle: "test-collection",
                  image: { url: "https://example.com/image.jpg" },
                  metafield: null,
                  tagsMetafield: {
                    value: "invalid json",
                  },
                },
              },
            ],
          },
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const collections = await collectionsApi.fetchCollections();

      expect(collections[0].collectionTags).toEqual([]);
    });
  });
});
