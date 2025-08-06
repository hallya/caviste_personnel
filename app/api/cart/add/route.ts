import { NextResponse } from "next/server";
import type { ShopifyUserError } from "../../../types/shopify";

export async function POST(req: Request) {
  const { cartId, variantId, quantity = 1 } = await req.json();

  if (!variantId) {
    return NextResponse.json({ error: "variantId manquant" }, { status: 400 });
  }

  const domain = process.env.SHOPIFY_STORE_DOMAIN!;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

  const cartCreate = /* GraphQL */ `
    mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          totalQuantity
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const cartLinesAdd = /* GraphQL */ `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const endpoint = `https://${domain}/api/2023-07/graphql.json`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": token,
  };

  const body = cartId
    ? {
        query: cartLinesAdd,
        variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
      }
    : {
        query: cartCreate,
        variables: { lines: [{ merchandiseId: variantId, quantity }] },
      };

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = await res.json();

  const payload = cartId ? json?.data?.cartLinesAdd : json?.data?.cartCreate;
  const errors = payload?.userErrors?.filter((e: ShopifyUserError) => e?.message) ?? [];

  if (!res.ok || errors.length) {
    return NextResponse.json(
      { error: errors[0]?.message || "Shopify error" },
      { status: 400 }
    );
  }

  const cart = payload?.cart;
  return NextResponse.json({
    cartId: cart?.id ?? null,
    checkoutUrl: cart?.checkoutUrl ?? null,
    totalQuantity: cart?.totalQuantity ?? 0,
  });
}
