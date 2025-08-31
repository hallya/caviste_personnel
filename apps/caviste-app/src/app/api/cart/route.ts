import {
  GetCartDetailedDocument,
  mapCartDetailedQueryDtoToDomain,
  type GraphQLError,
} from "@pkg/services-shopify";
import { NextRequest, NextResponse } from "next/server";
import { CartDetailed } from "@pkg/domain";
import { shopifyApi } from "../../services/client";

export async function GET(
  request: NextRequest
): Promise<NextResponse<CartDetailed | null | { errors: GraphQLError[] }>> {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get("cartId");

  if (!cartId) {
    return NextResponse.json(
      { errors: [{ message: "cartId requis" }] },
      { status: 400 }
    );
  }

  return await shopifyApi.query(
    GetCartDetailedDocument,
    { cartId },
    mapCartDetailedQueryDtoToDomain
  );
}
