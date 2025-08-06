import { NextResponse } from "next/server";

type Vars = { handle: string; first: number; after?: string | null };

export type CollectionProducts = {
  title: string | null;
  products: {
    id: string;
    title: string;
    image: string | null;
    price: string | null;
    currency: string | null;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
};

export type Product = CollectionProducts["products"][0];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");
  const first = Number(searchParams.get("first") || 12);
  const after = searchParams.get("after");

  // 🔹 Ne pas passer "null" comme curseur à Shopify
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

  const variables: Vars = { handle, first, after: cursor };

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

  const products = edges.map((e: any) => ({
    id: e.node.id,
    title: e.node.title,
    image: e.node.featuredImage?.url ?? null,
    price: e.node.priceRange?.minVariantPrice?.amount ?? null,
    currency: e.node.priceRange?.minVariantPrice?.currencyCode ?? null,
  }));

  return NextResponse.json({
    title: collection?.title ?? null,
    products,
    pageInfo,
  });
}
