import { NextResponse } from "next/server";
import type { ShopifyCartLine, ShopifyUserError } from "../../../types/shopify";

export async function POST(req: Request) {
  try {
    const { cartId, lineId } = await req.json();

    if (!cartId || !lineId) {
      return NextResponse.json(
        { error: "cartId et lineId requis" },
        { status: 400 }
      );
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
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
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
          userErrors {
            field
            message
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
        variables: {
          cartId,
          lineIds: [lineId],
        },
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erreur Shopify" },
        { status: res.status }
      );
    }

    const json = await res.json();
    
    if (json?.errors?.length) {
      const graphqlError = json.errors[0];
      
      if (graphqlError?.extensions?.code === "RESOURCE_NOT_FOUND") {
        return NextResponse.json(
          { error: "Article déjà supprimé ou panier modifié par une autre session" },
          { status: 409 } // Conflict
        );
      }
      
      return NextResponse.json(
        { error: graphqlError?.message || "Erreur GraphQL" },
        { status: 400 }
      );
    }
    
    const payload = json?.data?.cartLinesRemove;
    const userErrors = payload?.userErrors?.filter((e: ShopifyUserError) => e?.message) ?? [];

    if (userErrors.length) {
      return NextResponse.json(
        { error: userErrors[0]?.message || "Erreur lors de la suppression" },
        { status: 400 }
      );
    }

    const cart = payload?.cart;
    
    // Si le panier est null après suppression, c'est que la suppression a réussi mais le panier est vide
    if (!cart) {

      return NextResponse.json({
        id: null,
        totalQuantity: 0,
        totalAmount: "0.00 EUR",
        checkoutUrl: null,
        lines: [],
        message: "Produit supprimé avec succès"
      });
    }

    const lines = cart?.lines?.edges?.map((edge: { node: ShopifyCartLine }) => {
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
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json({ error: "Erreur de connexion" }, { status: 500 });
  }
}
