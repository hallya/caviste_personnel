import { NextRequest, NextResponse } from "next/server";
import type { ShopifyCartLine } from "../../types/shopify";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get("cartId");

    if (!cartId) {
      return NextResponse.json({ error: "cartId requis" }, { status: 400 });
    }

    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const domain = process.env.SHOPIFY_STORE_DOMAIN;

    if (!token || !domain) {
      return NextResponse.json(
        { error: "Configuration Shopify manquante" },
        { status: 500 }
      );
    }

    const query = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          totalQuantity
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
          lines(first: 100) {
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
      body: JSON.stringify({
        query,
        variables: { cartId },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erreur Shopify" },
        { status: res.status }
      );
    }

    const json = await res.json();
    const cart = json?.data?.cart;

    if (!cart) {
      return NextResponse.json({ error: "Panier non trouvé" }, { status: 404 });
    }

    const lines =
      cart?.lines?.edges?.map((edge: { node: ShopifyCartLine }) => {
        const node = edge.node;
        const merchandise = node.merchandise;
        const unitPrice = merchandise?.price?.amount
          ? parseFloat(merchandise.price.amount)
          : 0;
        const currency = merchandise?.price?.currencyCode || "EUR";
        const lineTotal = (unitPrice * node.quantity).toFixed(2);

        return {
          id: node.id,
          quantity: node.quantity,
          title:
            merchandise?.product?.title ||
            merchandise?.title ||
            "Produit inconnu",
          price: merchandise?.price?.amount
            ? `${merchandise.price.amount} ${merchandise.price.currencyCode}`
            : "Prix non disponible",
          unitPrice,
          currency,
          lineTotal: `${lineTotal} ${currency}`,
          image: merchandise?.product?.featuredImage?.url || null,
          availableForSale: merchandise?.availableForSale ?? false,
          quantityAvailable: merchandise?.quantityAvailable ?? 0,
        };
      }) || [];

    const totalAmount = cart?.cost?.subtotalAmount
      ? `${cart.cost.subtotalAmount.amount} ${cart.cost.subtotalAmount.currencyCode}`
      : "0.00 EUR";

    return NextResponse.json({
      id: cart?.id || null,
      totalQuantity: cart?.totalQuantity ?? 0,
      totalAmount: totalAmount,
      checkoutUrl: cart?.checkoutUrl ?? null,
      lines,
    });
  } catch (error) {
    console.error("Erreur lors du chargement du panier:", error);
    return NextResponse.json({ error: "Erreur de connexion" }, { status: 500 });
  }
}
