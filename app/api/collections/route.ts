import { NextResponse } from "next/server";
import type {
  ShopifyCollectionsGraphQLResponse,
  ShopifyCollectionGraphQLEdge,
} from "../../types/shopify";

export async function GET(req: Request) {
  new URL(req.url);

  const domain = process.env.SHOPIFY_STORE_DOMAIN!;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
  const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2023-07";
  
  if (!process.env.SHOPIFY_API_VERSION) {
    console.warn(`SHOPIFY_API_VERSION not set, using fallback: ${apiVersion}`);
  }

  const query = /* GraphQL */ `
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

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Shopify API error:", res.status, res.statusText);
    return NextResponse.json({ collections: [] }, { status: res.status });
  }

  const json = await res.json();

  if (json.errors) {
    console.error("GraphQL errors:", JSON.stringify(json.errors, null, 2));
    return NextResponse.json({ collections: [] }, { status: 500 });
  }

  const response = json as ShopifyCollectionsGraphQLResponse;
  const edges = response?.data?.collections?.edges ?? [];

  const collections = edges.map((edge: ShopifyCollectionGraphQLEdge) => {
    const node = edge.node;

    let videoUrl = null;
    if (
      node.metafield?.reference?.__typename === "GenericFile" &&
      node.metafield.reference.url
    ) {
      videoUrl = node.metafield.reference.url;
    } else if (
      node.metafield?.reference?.__typename === "Video" &&
      node.metafield.reference.sources?.[0]?.url
    ) {
      videoUrl = node.metafield.reference.sources[0].url;
    }

    let collectionTags: string[] = [];
    if (node.tagsMetafield?.value) {
      try {
        const tagsValue: string = node.tagsMetafield.value;

        const parsedTags = JSON.parse(tagsValue) as string[];
        collectionTags = parsedTags
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0);
      } catch (error) {
        console.warn(
          `Failed to parse collection tags for ${node.handle}:`,
          error
        );
      }
    }

    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      image: node.image?.url ?? null,
      videoCollection: videoUrl,
      collectionTags,
    };
  });

  return NextResponse.json({ collections });
}
