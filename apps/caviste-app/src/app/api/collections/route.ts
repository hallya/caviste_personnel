import {
  GetCollectionsDocument,
  mapGetCollectionsQueryDtoToDomain,
} from "@pkg/services-shopify";
import { NextResponse } from "next/server";
import { GraphQLError } from "@pkg/services-shopify";
import { Collection } from "@pkg/domain";
import { shopifyApi } from "../../services/client";

export async function GET(): Promise<
  NextResponse<Collection[] | null | { errors: GraphQLError[] }>
> {
  return await shopifyApi.query(
    GetCollectionsDocument,
    {
      first: 10,
    },
    mapGetCollectionsQueryDtoToDomain
  );
}
