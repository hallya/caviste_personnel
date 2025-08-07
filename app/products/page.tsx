import ProductsContainer from "../components/products/containers/ProductsContainer";
import type { ShopifyProduct, SimplifiedProduct } from "../types/shopify";

async function getProducts(): Promise<SimplifiedProduct[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const query = `
      query {
        products(first: 30) {
          edges {
            node {
              id
              title
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

  const res = await fetch(`https://${domain}/api/2023-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token!,
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 0 },
  });

  const json = await res.json();

  return json.data.products.edges.map((edge: { node: ShopifyProduct }) => ({
    id: edge.node.id,
    title: edge.node.title,
    image: edge.node.featuredImage?.url || null,
    price: edge.node.selectedOrFirstAvailableVariant?.price?.amount || null,
    currency: edge.node.selectedOrFirstAvailableVariant?.price?.currencyCode || null,
  }));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductsContainer products={products} />;
}
