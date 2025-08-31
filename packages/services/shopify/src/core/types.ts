import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

type RequestCache = "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";

export type GraphQLResponse<TData> = {
  data: TData;
  errors?: GraphQLError[];
};

export type GraphQLError = {
  message: string;
  path?: Array<string | number>;
  extensions?: {
    code?: string;
    [k: string]: unknown;
  };
};

export type GraphQLMutationResponse<TData> = {
  data: TData;
  errors?: GraphQLError[];
  userErrors?: UserError[];
};

export type UserError = {
  field: string[];
  message: string;
};

export type GraphQLClientConfig = {
  url: string;
  token: string;
  apiVersion: string;
  headers?: Record<string, string>;
};

export type FetchOptions = {
  signal?: AbortSignal;
  keepalive?: boolean;
};

export type NextOptions = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

export type GraphQLRequestOptions = FetchOptions & NextOptions;

export type ServerResponseOptions = {
  successStatus?: number;
  errorStatus?: number;
  headers?: Record<string, string>;
};

export type GraphQLDocument<TData, TVars> = TypedDocumentNode<TData, TVars>;
