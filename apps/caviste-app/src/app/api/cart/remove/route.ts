import { NextResponse } from "next/server";
import {
  CartLinesRemoveDocument,
  GraphQLError,
  mapCartLinesRemoveMutationDtoToDomain,
} from "@pkg/services-shopify";
import { CartDetailed } from "@pkg/domain";
import { shopifyApi } from "../../../services/client";

export async function POST(
  req: Request
): Promise<NextResponse<CartDetailed | null | { errors: GraphQLError[] }>> {
  const { cartId, lineId } = await req.json();

  if (!cartId || !lineId) {
    return NextResponse.json(
      { errors: [{ message: "cartId et lineId requis" }] },
      { status: 400 }
    );
  }

  return await shopifyApi.mutate(
    CartLinesRemoveDocument,
    {
      cartId,
      lineIds: [lineId],
    },
    mapCartLinesRemoveMutationDtoToDomain
  );
}
