import { NextResponse } from "next/server";
import type { ShopifyCollectionsGraphQLResponse, ShopifyCollectionGraphQLEdge } from "../../types/shopify";

export async function GET(req: Request) {
  new URL(req.url);

  const domain = process.env.SHOPIFY_STORE_DOMAIN!;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

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
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${domain}/api/2023-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error('Shopify API error:', res.status, res.statusText);
    return NextResponse.json({ collections: [] }, { status: res.status });
  }

  const json = await res.json();

  if (json.errors) {
    console.error('GraphQL errors:', JSON.stringify(json.errors, null, 2));
    return NextResponse.json({ collections: [] }, { status: 500 });
  }

  const response = json as ShopifyCollectionsGraphQLResponse;
  const edges = response?.data?.collections?.edges ?? [];

  const collections = edges.map((edge: ShopifyCollectionGraphQLEdge) => {
    const node = edge.node;

    let videoUrl = null;
    if (node.metafield?.reference?.__typename === 'GenericFile' && node.metafield.reference.url) {
      videoUrl = node.metafield.reference.url;
    } else if (node.metafield?.reference?.__typename === 'Video' && node.metafield.reference.sources?.[0]?.url) {
      videoUrl = node.metafield.reference.sources[0].url;
    }

    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      image: node.image?.url ?? null,
      videoCollection: videoUrl,
    };
  });

  return NextResponse.json({ collections });
}
