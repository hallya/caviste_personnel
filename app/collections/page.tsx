import { Metadata } from "next";
import CollectionsContainer from "./containers/CollectionsContainer";
import type { Collection } from "../components/carousel/types";
import type { ShopifyCollectionGraphQLEdge } from "../types/shopify";

async function getCollections(): Promise<Collection[]> {
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

  try {
    const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 300 }
    });

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

    return edges.map((edge: ShopifyCollectionGraphQLEdge) => {
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
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "Collections - Edouard, Caviste personnel",
  description: "Découvrez nos collections de vins sélectionnés par Edouard, votre caviste personnel.",
};

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [collections, resolvedSearchParams] = await Promise.all([
    getCollections(),
    searchParams,
  ]);

  return (
    <CollectionsContainer
      initialCollections={collections}
      searchParams={resolvedSearchParams}
    />
  );
}