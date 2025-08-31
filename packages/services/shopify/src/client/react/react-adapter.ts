'use client'

import { useCallback, useState } from "react";
import { createShopifyClient } from "../core";
import type { GraphQLClientConfig } from "../../core";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { GraphQLResponse, GraphQLRequestOptions } from "../../core";
import type { ShopifyHookAdapter } from "../types";

export function createShopifyHook(config?: Partial<GraphQLClientConfig>): ShopifyHookAdapter {
  const client = createShopifyClient(config);

  return function useShopify() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const query = useCallback(
      async <TData, TVars>(
        document: TypedDocumentNode<TData, TVars>,
        variables: TVars,
        options?: GraphQLRequestOptions
      ): Promise<GraphQLResponse<TData>> => {
        setLoading(true);
        setError(null);

        try {
          const result = await client.request(document, variables, options);
          return result;
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Erreur inconnue";
          setError(errorMessage);
          throw err;
        } finally {
          setLoading(false);
        }
      },
      [client]
    );

    const mutate = useCallback(
      async <TData, TVars>(
        document: TypedDocumentNode<TData, TVars>,
        variables: TVars,
        options?: GraphQLRequestOptions
      ): Promise<GraphQLResponse<TData>> => {
        setLoading(true);
        setError(null);

        try {
          const result = await client.mutate(document, variables, options);
          return result;
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Erreur inconnue";
          setError(errorMessage);
          throw err;
        } finally {
          setLoading(false);
        }
      },
      [client]
    );

    return { query, mutate, loading, error };
  };
}

export const useShopify = createShopifyHook();