import { env } from "@pkg/config-env";
import {
  createShopifyAPI,
  createShopifyHook,
  createShopifyPage,
  ShopifyAPIAdapter,
  ShopifyPageAdapter,
  ShopifyHookAdapter,
} from "@pkg/services-shopify";

const url = `https://${env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`;
const token = env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = env.NEXT_PUBLIC_SHOPIFY_API_VERSION;

export const shopifyApi: ShopifyAPIAdapter = createShopifyAPI({
  url,
  token,
  apiVersion,
});

export const shopifyPage: ShopifyPageAdapter = createShopifyPage({
  url,
  token,
  apiVersion,
});

export const useShopify: ShopifyHookAdapter = createShopifyHook({
  url,
  token,
  apiVersion,
});
