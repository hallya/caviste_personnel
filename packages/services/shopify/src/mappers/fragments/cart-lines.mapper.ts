import { type CartDetailed } from "@pkg/domain";
import { type CartDetailedFragment as CartDetailedDto } from "../../__generated__/graphql";
import {
  DEFAULT_CURRENCY_CODE,
  DEFAULT_PRODUCT_QUANTITY_AVAILABLE,
  DEFAULT_IMAGE_URL,
} from "../../constants";
import { DEFAULT_AMOUNT } from "../../constants";

export function mapCartLinesDtoToDomain(
  cartLines: CartDetailedDto["lines"]
): CartDetailed["lines"] {
  return cartLines.edges.map((line) => {
    const { merchandise, quantity, id } = line.node;
    const {
      price,
      image,
      availableForSale,
      quantityAvailable,
      product,
      id: variantId,
      title,
    } = merchandise;
    const unitPrice = price?.amount ? Number(price.amount) : DEFAULT_AMOUNT;
    const lineTotal = unitPrice * quantity;
    const currency = price?.currencyCode ?? DEFAULT_CURRENCY_CODE;

    return {
      id,
      variantId,
      currency,
      title: product?.title ?? title ?? "Produit inconnu",
      unitPrice,
      lineTotal: `${lineTotal.toFixed(2)} ${currency}`,
      quantity,
      imageUrl: image?.url ?? DEFAULT_IMAGE_URL,
      availableForSale: availableForSale,
      quantityAvailable:
        quantityAvailable ?? DEFAULT_PRODUCT_QUANTITY_AVAILABLE,
    };
  });
}
