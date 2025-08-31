import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import {
  GraphQLClientConfig,
  GraphQLRequestOptions,
  GraphQLResponse,
  GraphQLMutationResponse,
  GraphQLNetworkError,
  GraphQLErrorResponse,
} from "../../core";

export class GraphQLClient {
  private config: GraphQLClientConfig;

  constructor(config: GraphQLClientConfig) {
    this.config = config;
  }

  async request<TData, TVars>(
    document: TypedDocumentNode<TData, TVars>,
    variables: TVars,
    options: GraphQLRequestOptions = {}
  ): Promise<GraphQLResponse<TData>> {
    const { url, token, apiVersion, headers = {} } = this.config;

    const { cache, revalidate, tags, ...fetchOptions } = options;
    
    const fetchInit: RequestInit = {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": token,
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        query: print(document),
        variables,
      }),
      ...fetchOptions,
    };

    if (cache !== undefined || revalidate !== undefined || tags !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fetchInit as any).next = { // next implements options that are not part of RequestInit
        ...(cache !== undefined && { cache }),
        ...(revalidate !== undefined && { revalidate }),
        ...(tags !== undefined && { tags }),
      };
    }

    const response = await fetch(`${url}/api/${apiVersion}/graphql.json`, fetchInit);

    if (!response.ok) {
      throw new GraphQLNetworkError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const result = (await response.json()) as GraphQLResponse<TData>;

    if (result.errors && result.errors.length > 0) {
      throw new GraphQLErrorResponse(result.errors);
    }

    return result;
  }

  async mutate<TData, TVars>(
    document: TypedDocumentNode<TData, TVars>,
    variables: TVars,
    options: GraphQLRequestOptions = {}
  ): Promise<GraphQLMutationResponse<TData>> {
    const result = await this.request(document, variables, options);

    return result as GraphQLMutationResponse<TData>;
  }
}
