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
    body: JSON.stringify({ query, variables: { id: cartId } }),
    cache: "no-store",
  });

  if (!res.ok) return NextResponse.json({ totalQuantity: 0, checkoutUrl: null }, { status: res.status });
  const json = await res.json();
  const cart = json?.data?.cart;
  
  const lines = cart?.lines?.edges?.map((edge: { node: { id: string; quantity: number; merchandise: { title?: string; price?: { amount: string; currencyCode: string }; availableForSale?: boolean; quantityAvailable?: number; product?: { title?: string; featuredImage?: { url: string } } } } }) => {
    const node = edge.node;
    const merchandise = node.merchandise;
    return {
      id: node.id,
      quantity: node.quantity,
      title: merchandise?.product?.title || merchandise?.title || "Produit inconnu",
      price: merchandise?.price?.amount ? `${merchandise.price.amount} ${merchandise.price.currencyCode}` : "Prix non disponible",
      image: merchandise?.product?.featuredImage?.url || null,
      availableForSale: merchandise?.availableForSale ?? false,
      quantityAvailable: merchandise?.quantityAvailable ?? 0,
    };
  }) || [];

  const totalAmount = lines.reduce((total: number, line: { price: string; quantity: number }) => {
    const priceMatch = line.price.match(/(\d+\.?\d*)/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      return total + (price * line.quantity);
    }
    return total;
  }, 0);

  const currency = lines.length > 0 ? lines[0].price.split(' ')[1] || 'EUR' : 'EUR';

  return NextResponse.json({
    id: cart?.id || null,
    totalQuantity: cart?.totalQuantity ?? 0,
    totalAmount: `${totalAmount.toFixed(2)} ${currency}`,
    checkoutUrl: cart?.checkoutUrl ?? null,
    lines,
  });
}
