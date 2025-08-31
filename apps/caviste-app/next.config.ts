import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@pkg/analytics",
    "@pkg/cart",
    "@pkg/catalog",
    "@pkg/config",
    "@pkg/core",
    "@pkg/design-system",
    "@pkg/notifications",
    "@pkg/seo",
    "@pkg/services-shopify",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },

  output: "standalone",

  experimental: {
    externalDir: true,
  },

  productionBrowserSourceMaps: true,
};

export default nextConfig;
