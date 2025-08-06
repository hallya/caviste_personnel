import { NextResponse } from "next/server";
import { ShopifyCollection } from "../../types/shopify";

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
    return NextResponse.json({ collections: [] }, { status: res.status });
  }

  const json = await res.json();
  const edges = json?.data?.collections?.edges ?? [];
  const collections = edges.map((e: { node: ShopifyCollection }) => {
    const n = e.node;
    return {
      id: n.id,
      title: n.title,
      handle: n.handle,
      image: n.image?.url ?? null,
    };
  });

  return NextResponse.json({ collections });
}
