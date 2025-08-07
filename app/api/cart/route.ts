import { NextResponse } from "next/server";
import type { 
  ShopifyCartQueryVars, 
  ShopifyCart,
  ShopifyCartLine 
} from "../../types/shopify";

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
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                  product {
                    title
                    featuredImage {
                      url
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
    body: JSON.stringify({ query, variables: { id: cartId } as ShopifyCartQueryVars }),
    cache: "no-store",
  });

  if (!res.ok) return NextResponse.json({ totalQuantity: 0, checkoutUrl: null }, { status: res.status });
  
  const json = await res.json();
  const cart = json?.data?.cart as ShopifyCart;
  
  const lines = cart?.lines?.edges?.map((edge) => {
    const node = edge.node as ShopifyCartLine;
    const merchandise = node.merchandise;
    const unitPrice = merchandise?.price?.amount ? parseFloat(merchandise.price.amount) : 0;
    const currency = merchandise?.price?.currencyCode || 'EUR';
    const lineTotal = (unitPrice * node.quantity).toFixed(2);
    
    return {
      id: node.id,
      quantity: node.quantity,
      title: merchandise?.product?.title || merchandise?.title || "Produit inconnu",
      price: merchandise?.price?.amount ? `${merchandise.price.amount} ${merchandise.price.currencyCode}` : "Prix non disponible",
      unitPrice,
      currency,
      lineTotal: `${lineTotal} ${currency}`,
      image: merchandise?.product?.featuredImage?.url || null,
      availableForSale: merchandise?.availableForSale ?? false,
      quantityAvailable: merchandise?.quantityAvailable ?? 0,
      variantId: merchandise?.id,
    };
  }) || [];

  // Utiliser le total calculé par Shopify si disponible, sinon calculer nous-mêmes
  const totalAmount = cart?.cost?.subtotalAmount 
    ? `${cart.cost.subtotalAmount.amount} ${cart.cost.subtotalAmount.currencyCode}`
    : lines.length > 0 
    ? `${lines.reduce((total, line) => total + (line.unitPrice * line.quantity), 0).toFixed(2)} ${lines[0].currency}`
    : "0.00 EUR";

  return NextResponse.json({
    id: cart?.id || null,
    totalQuantity: cart?.totalQuantity ?? 0,
    totalAmount: totalAmount,
    checkoutUrl: cart?.checkoutUrl ?? null,
    lines,
  });
}
