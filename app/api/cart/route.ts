import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cartId = searchParams.get("cartId");
  if (!cartId) return NextResponse.json({ totalQuantity: 0, checkoutUrl: null });

  const domain = process.env.SHOPIFY_STORE_DOMAIN!;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

  const query = /* GraphQL */ `
    query getCart($id: ID!) {
      cart(id: $id) {
        id
        totalQuantity
        checkoutUrl
      }
    }
  `;

  const res = await fetch(`https://${domain}/api/2023-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables: { id: cartId } }),
    cache: "no-store",
  });

  if (!res.ok) return NextResponse.json({ totalQuantity: 0, checkoutUrl: null }, { status: res.status });
  const json = await res.json();
  const cart = json?.data?.cart;
  return NextResponse.json({
    totalQuantity: cart?.totalQuantity ?? 0,
    checkoutUrl: cart?.checkoutUrl ?? null,
  });
}
