// app/api/collection/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");
  const first = Number(searchParams.get("first") || 12);

  if (!handle) return NextResponse.json({ products: [] });

  const domain = process.env.SHOPIFY_STORE_DOMAIN!;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

  const query = /* GraphQL */ `
    query CollectionProducts($handle: String!, $first: Int!) {
      collectionByHandle(handle: $handle) {
        title
        products(first: $first) {
          edges {
            node {
              id
              title
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
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
    body: JSON.stringify({ query, variables: { handle, first } }),
    cache: "no-store",
  });

  const json = await res.json();
  const edges = json?.data?.collectionByHandle?.products?.edges ?? [];
  const products = edges.map((e: any) => {
    const n = e.node;
    return {
      id: n.id,
      title: n.title,
      image: n.images?.edges?.[0]?.node?.url ?? null,
      price: n.variants?.edges?.[0]?.node?.price?.amount ?? null,
      currency: n.variants?.edges?.[0]?.node?.price?.currencyCode ?? "EUR",
    };
  });

  return NextResponse.json({ products });
}
