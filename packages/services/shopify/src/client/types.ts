import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type {
  GraphQLResponse,
  GraphQLRequestOptions,
  GraphQLError,
} from "../core";
import type { NextResponse } from "next/server";

export type ShopifyAPIAdapter = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: <TData, TVars, TMapper extends (data: TData) => any>(
    document: TypedDocumentNode<TData, TVars>,
    variables: TVars,
    mapper?: TMapper,
    options?: {
      successStatus?: number;
      errorStatus?: number;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<NextResponse<any | GraphQLError>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate: <TData, TVars, TMapper extends (data: TData) => any>(
    document: TypedDocumentNode<TData, TVars>,
    variables: TVars,
    mapper?: TMapper,
    options?: {
      successStatus?: number;
      errorStatus?: number;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<NextResponse<any>>;
};

export type ShopifyPageAdapter = {
  static: <TData, TVars>(
    document: TypedDocumentNode<TData, TVars>,
    variables: TVars
  ) => Promise<GraphQLResponse<TData>>;

  revalidate: <TData, TVars>(
    document: TypedDocumentNode<TData, TVars>,
    variables: TVars,
    revalidateSeconds?: number
  ) => Promise<GraphQLResponse<TData>>;

  dynamic: <TData, TVars>(
    document: TypedDocumentNode<TData, TVars>,
    variables: TVars
  ) => Promise<GraphQLResponse<TData>>;
};

export type ShopifyHookAdapter = () => {
  query: <TData, TVars>(
    document: TypedDocumentNode<TData, TVars>,
    variables: TVars,
    options?: GraphQLRequestOptions
  ) => Promise<GraphQLResponse<TData>>;

  mutate: <TData, TVars>(
    document: TypedDocumentNode<TData, TVars>,
    variables: TVars,
    options?: GraphQLRequestOptions
  ) => Promise<GraphQLResponse<TData>>;

  loading: boolean;
  error: string | null;
};
