import type { SimplifiedProduct } from "../../types/shopify";
import Image from "next/image";
import ImagePlaceholder from "./ImagePlaceholder";

interface ProductCardProps {
  product: SimplifiedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasPrice = product.price ?? product.currency;
  
  return (
    <article
      className="bg-[#f4f1ee] rounded-md p-4 text-center flex flex-col min-h-100"
      aria-labelledby={`product-title-${product.id}`}
    >
      <figure className="relative flex-1 mb-2 min-h-0 rounded overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={`Image de ${product.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <ImagePlaceholder title={product.title} />
        )}

        {hasPrice && (
          <figcaption className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-[#7a2d2d]">
            {product.price} {product.currency}
          </figcaption>
        )}
      </figure>
      
      <header className="h-16 flex items-center justify-center">
        <h3
          id={`product-title-${product.id}`}
          className="text-sm text-[#7a2d2d] line-clamp-2 font-semibold"
        >
          {product.title}
        </h3>
      </header>
    </article>
  );
} 