import { createShopifyClient } from "../core";
import type { GraphQLClientConfig, GraphQLResponse } from "../../core";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { ShopifyPageAdapter } from "../types";

export function createShopifyPage(config?: Partial<GraphQLClientConfig>): ShopifyPageAdapter {
  const client = createShopifyClient(config);

  return {
    static: <TData, TVars>(
      document: TypedDocumentNode<TData, TVars>,
      variables: TVars
    ): Promise<GraphQLResponse<TData>> => {
      return client.request(document, variables, {
        cache: "force-cache",
      });
    },

    revalidate: <TData, TVars>(
      document: TypedDocumentNode<TData, TVars>,
      variables: TVars,
      revalidateSeconds: number = 3600
    ): Promise<GraphQLResponse<TData>> => {
      return client.request(document, variables, {
        cache: "force-cache",
        revalidate: revalidateSeconds,
      });
    },

    dynamic: <TData, TVars>(
      document: TypedDocumentNode<TData, TVars>,
      variables: TVars
    ): Promise<GraphQLResponse<TData>> => {
      return client.request(document, variables, {
        cache: "no-store",
      });
    },
  };
}

export const shopifyPage = createShopifyPage();