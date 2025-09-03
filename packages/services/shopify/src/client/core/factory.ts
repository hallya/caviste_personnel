import { env } from "@pkg/config-env";
import { GraphQLClient } from "./graphql-client";
import { GraphQLClientConfig } from "../../core";

export function createShopifyClient(config?: Partial<GraphQLClientConfig>): GraphQLClient {
  const defaultConfig: GraphQLClientConfig = {
    url: `https://${env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`,
    token: env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    apiVersion: env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  };

  const finalConfig = { ...defaultConfig, ...config };

  if (!finalConfig.url) {
    throw new Error("SHOPIFY_STORE_DOMAIN environment variable is not defined");
  }
  if (!finalConfig.token) {
    throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable is not defined");
  }
  if (!finalConfig.apiVersion) {
    throw new Error("SHOPIFY_API_VERSION environment variable is not defined");
  }

  return new GraphQLClient(finalConfig);
}

export const shopifyClient = createShopifyClient();