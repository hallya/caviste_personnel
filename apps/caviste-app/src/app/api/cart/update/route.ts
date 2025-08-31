import {
  CartLinesUpdateDocument,
  GraphQLError,
  mapCartLinesUpdateMutationDtoToDomain,
} from "@pkg/services-shopify";
import { NextResponse } from "next/server";
import { CartDetailed } from "@pkg/domain";
import { shopifyApi } from "../../../services/client";

export async function POST(
  req: Request
): Promise<NextResponse<CartDetailed | null | { errors: GraphQLError[] }>> {
  const { cartId, lineId, quantity } = await req.json();

  if (!cartId || !lineId || quantity === undefined) {
    return NextResponse.json(
      { errors: [{ message: "cartId, lineId et quantity requis" }] },
      { status: 400 }
    );
  }

  if (quantity < 0) {
    return NextResponse.json(
      { errors: [{ message: "Quantité invalide" }] },
      { status: 400 }
    );
  }

  return await shopifyApi.mutate(
    CartLinesUpdateDocument,
    {
      cartId,
      lines: [
        {
          quantity,
          attributes: [],
          merchandiseId: lineId,
          sellingPlanId: null,
          id: lineId,
        },
      ],
    },
    mapCartLinesUpdateMutationDtoToDomain
  );
}
