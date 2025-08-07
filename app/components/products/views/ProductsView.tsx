import Image from "next/image";
import type { SimplifiedProduct } from "../../../types/shopify";

interface ProductsViewProps {
  products: SimplifiedProduct[];
}

export default function ProductsView({ products }: ProductsViewProps) {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg shadow hover:shadow-md transition p-4"
        >
          {product.image ? (
            <div className="relative w-full h-60 rounded overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-full h-60 bg-neutral-200 flex items-center justify-center text-sm text-neutral-500 rounded">
              Aucune image
            </div>
          )}
          <h2 className="mt-4 text-lg font-semibold">{product.title}</h2>
          <p className="text-sm text-neutral-700 mt-1">{product.price || 'Prix non disponible'}</p>
        </div>
      ))}
    </div>
  );
} 