import { NextResponse } from "next/server";
import type {
  ShopifyProduct,
  CollectionProductsVars,
} from "../../types/shopify";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");
  const first = Number(searchParams.get("first") || 12);
  const after = searchParams.get("after");

  // 🔹 Don't pass "null" as cursor to Shopify
  const cursor = after && after !== "null" ? after : null;

  if (!handle) {
    return NextResponse.json({
      title: null,
      products: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    });
  }

  const domain = process.env.SHOPIFY_STORE_DOMAIN!;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

  const query = /* GraphQL */ `
    query getCollectionProducts(
      $handle: String!
      $first: Int!
      $after: String
    ) {
      collectionByHandle(handle: $handle) {
        title
        products(first: $first, after: $after) {
          edges {
            cursor
            node {
              id
              title
              featuredImage {
                url
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              selectedOrFirstAvailableVariant {
                id
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  const variables: CollectionProductsVars = { handle, first, after: cursor };

  const res = await fetch(`https://${domain}/api/2023-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      {
        title: null,
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      },
      { status: res.status }
    );
  }

  const json = await res.json();

  const collection = json?.data?.collectionByHandle ?? null;
  const edges = collection?.products?.edges ?? [];
  const pageInfo = collection?.products?.pageInfo ?? {
    hasNextPage: false,
    endCursor: null,
  };

  const products = edges.map((e: { node: ShopifyProduct }) => {
    const variant = e.node.selectedOrFirstAvailableVariant;
    return {
      id: e.node.id,
      title: e.node.title,
      image: e.node.featuredImage?.url ?? null,
      price: variant?.price?.amount ?? null,
      currency: variant?.price?.currencyCode ?? null,
      variantId: variant?.availableForSale ? variant.id : null,
    };
  });

  return NextResponse.json({
    title: collection?.title ?? null,
    products,
    pageInfo,
  });
}
