import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: {
    [`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`]: {
      headers: {
        "X-Shopify-Storefront-Access-Token":
          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
    },
  },
  documents: [
    "src/graphql/**/*.{graphql,gql}",
  ],
  generates: {
    "src/__generated__/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        preResolveTypes: true,
        avoidOptionals: true,
        maybeValue: "T | null",
        nonOptionalTypename: true,
        immutableTypes: true,
      },
      hooks: {
        afterAllFileWrite: ["prettier --write"],
      },
    },
  },
};

export default config;
