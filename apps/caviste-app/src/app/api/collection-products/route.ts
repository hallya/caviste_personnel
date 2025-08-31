import { NextResponse } from "next/server";
import {
  GraphQLError,
  GetCollectionProductsDocument,
  ProductCollectionSortKeys,
  mapCollectionProductQueryDtoToDomain,
} from "@pkg/services-shopify";
import { CollectionProducts } from "@pkg/domain";
import { shopifyApi } from "../../services/client";

export async function GET(
  req: Request
): Promise<
  NextResponse<CollectionProducts | null | { errors: GraphQLError[] }>
> {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");
  const first = Number(searchParams.get("first") || 12);
  const after = searchParams.get("after");
  const sortKey = searchParams.get("sortKey");

  const cursor = after && after !== "null" ? after : null;
  const validSortKey =
    sortKey && sortKey in ProductCollectionSortKeys
      ? ProductCollectionSortKeys[
          sortKey as keyof typeof ProductCollectionSortKeys
        ]
      : ProductCollectionSortKeys.CollectionDefault;

  if (!handle) {
    return NextResponse.json(
      { errors: [{ message: "handle manquant" }] },
      { status: 400 }
    );
  }

  return await shopifyApi.query(
    GetCollectionProductsDocument,
    {
      handle,
      first,
      after: cursor,
      sortKey: validSortKey,
    },
    mapCollectionProductQueryDtoToDomain
  );
}
