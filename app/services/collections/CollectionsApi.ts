import type { Collection } from "../../components/carousel/types";
import type { ShopifyCollectionGraphQLEdge } from "../../types/shopify";

export class CollectionsApi {
  private domain: string;
  private token: string;
  private apiVersion: string;

  constructor() {
    this.domain = process.env.SHOPIFY_STORE_DOMAIN!;
    this.token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
    this.apiVersion = process.env.SHOPIFY_API_VERSION ?? "2023-07";

    if (!process.env.SHOPIFY_API_VERSION) {
      console.warn(
        `SHOPIFY_API_VERSION not set, using fallback: ${this.apiVersion}`
      );
    }
  }

  private getGraphQLQuery(): string {
    return /* GraphQL */ `
      query {
        collections(first: 20) {
          edges {
            node {
              id
              title
              handle
              image {
                url
              }
              metafield(namespace: "custom", key: "video_collection") {
                type
                reference {
                  __typename
                  ... on GenericFile {
                    url
                    mimeType
                  }
                  ... on Video {
                    sources {
                      url
                      mimeType
                      format
                    }
                    previewImage {
                      url
                    }
                  }
                }
              }
              tagsMetafield: metafield(namespace: "custom", key: "balises") {
                type
                value
              }
            }
          }
        }
      }
    `;
  }

  private parseVideoUrl(
    node: ShopifyCollectionGraphQLEdge["node"]
  ): string | null {
    if (
      node.metafield?.reference?.__typename === "GenericFile" &&
      node.metafield.reference.url
    ) {
      return node.metafield.reference.url;
    } else if (
      node.metafield?.reference?.__typename === "Video" &&
      node.metafield.reference.sources?.[0]?.url
    ) {
      return node.metafield.reference.sources[0].url;
    }
    return null;
  }

  private parseCollectionTags(
    node: ShopifyCollectionGraphQLEdge["node"]
  ): string[] {
    if (!node.tagsMetafield?.value) {
      return [];
    }

    try {
      const tagsValue: string = node.tagsMetafield.value;
      const parsedTags = JSON.parse(tagsValue) as string[];
      return parsedTags
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
    } catch (error) {
      console.warn(
        `Failed to parse collection tags for ${node.handle}:`,
        error
      );
      return [];
    }
  }

  private transformShopifyNode(edge: ShopifyCollectionGraphQLEdge): Collection {
    const node = edge.node;

    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      image: node.image?.url ?? null,
      videoCollection: this.parseVideoUrl(node),
      collectionTags: this.parseCollectionTags(node),
    };
  }

  async fetchCollections(): Promise<Collection[]> {
    try {
      const res = await fetch(
        `https://${this.domain}/api/${this.apiVersion}/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": this.token,
          },
          body: JSON.stringify({ query: this.getGraphQLQuery() }),
          next: { revalidate: 300 },
        }
      );

      if (!res.ok) {
        console.error("Shopify API error:", res.status, res.statusText);
        return [];
      }

      const json = await res.json();

      if (json.errors) {
        console.error("GraphQL errors:", JSON.stringify(json.errors, null, 2));
        return [];
      }

      const edges = json?.data?.collections?.edges ?? [];
      return edges.map((edge: ShopifyCollectionGraphQLEdge) =>
        this.transformShopifyNode(edge)
      );
    } catch (error) {
      console.error("Error fetching collections:", error);
      return [];
    }
  }
}
