import { NextResponse } from "next/server";
import {
  GraphQLError,
  CartLinesAddDocument,
  mapCartAddLinesMutationDtoToDomain,
} from "@pkg/services-shopify";
import { CartDetailed } from "@pkg/domain";
import { shopifyApi } from "../../../services/client";

export async function POST(
  req: Request
): Promise<NextResponse<CartDetailed | null | { errors: GraphQLError[] }>> {
  const { cartId, variantId, quantity = 1 } = await req.json();

  if (!variantId) {
    return NextResponse.json(
      { errors: [{ message: "variantId manquant" }] },
      { status: 400 }
    );
  }

  return await shopifyApi.mutate(
    CartLinesAddDocument,
    {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity,
          sellingPlanId: null,
          attributes: [],
        },
      ],
    },
    mapCartAddLinesMutationDtoToDomain
  );
}
