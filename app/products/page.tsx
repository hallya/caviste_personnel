// app/products/page.tsx

import { SimplifiedProduct } from "../types/shopify";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  image: { url: string };
  price: string;
};

async function getProducts(): Promise<Product[]> {
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

  return json.data.products.edges.map((edge: { node: SimplifiedProduct }) => ({
    id: edge.node.id,
    title: edge.node.title,
    image: edge.node.image,
    price: edge.node.price,
  }));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg shadow hover:shadow-md transition p-4"
        >
          {product.image?.url ? (
            <div className="relative w-full h-60 rounded overflow-hidden">
              <Image
                src={product.image.url}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-full h-60 bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded">
              Aucune image
            </div>
          )}
          <h2 className="mt-4 text-lg font-semibold">{product.title}</h2>
          <p className="text-sm text-gray-700 mt-1">{product.price} €</p>
        </div>
      ))}
    </div>
  );
}
