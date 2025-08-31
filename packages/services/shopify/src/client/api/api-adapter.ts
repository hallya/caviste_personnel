import { NextResponse } from "next/server";
import { createShopifyClient } from "../core";
import { GraphQLErrorResponse, GraphQLNetworkError, GraphQLClientConfig } from "../../core";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { GraphQLError } from "../../core";
import type { ShopifyAPIAdapter } from "../types";

type SuccessResponse<
  TData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMapper extends (data: TData) => any,
> = TMapper extends (data: TData) => infer R ? R : TData;
type ErrorResponse = {
  errors: GraphQLError[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response<TData, TMapper extends (data: TData) => any> =
  | SuccessResponse<TData, TMapper>
  | ErrorResponse;

export function createShopifyAPI(config?: Partial<GraphQLClientConfig>): ShopifyAPIAdapter {
  const client = createShopifyClient(config);

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: async <TData, TVars, TMapper extends (data: TData) => any>(
      document: TypedDocumentNode<TData, TVars>,
      variables: TVars,
      mapper?: TMapper,
      options?: {
        successStatus?: number;
        errorStatus?: number;
      }
    ): Promise<NextResponse<Response<TData, TMapper>>> => {
      try {
        const { data } = await client.request(document, variables);

        return NextResponse.json(
          (mapper ? mapper(data) : data) as SuccessResponse<TData, TMapper>,
          {
            status: options?.successStatus || 200,
          }
        );
      } catch (error) {
        return handleAPIError(error, options?.errorStatus);
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutate: async <TData, TVars, TMapper extends (data: TData) => any>(
      document: TypedDocumentNode<TData, TVars>,
      variables: TVars,
      mapper?: TMapper,
      options?: {
        successStatus?: number;
        errorStatus?: number;
      }
    ): Promise<NextResponse<Response<TData, TMapper>>> => {
      try {
        const { data, userErrors } = await client.mutate(document, variables);

        if (userErrors && userErrors.length > 0) {
          return NextResponse.json(
            { errors: userErrors.map((e) => ({ message: e.message })) },
            { status: options?.errorStatus || 400 }
          );
        }

        return NextResponse.json(
          (mapper ? mapper(data) : data) as SuccessResponse<TData, TMapper>,
          {
            status: options?.successStatus || 200,
          }
        );
      } catch (error) {
        return handleAPIError(error, options?.errorStatus);
      }
    },
  };
}

export const shopifyAPI = createShopifyAPI();

function handleAPIError(error: unknown, defaultStatus = 500) {
  console.error("GraphQL API error:", error);

  if (error instanceof GraphQLErrorResponse) {
    return NextResponse.json(
      { errors: error.errors },
      { status: defaultStatus }
    );
  }

  if (error instanceof GraphQLNetworkError) {
    return NextResponse.json(
      { errors: [{ message: error.message }] },
      { status: error.status }
    );
  }

  return NextResponse.json(
    { errors: [{ message: "Internal server error" }] },
    { status: defaultStatus }
  );
}
