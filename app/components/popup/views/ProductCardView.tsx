import type { SimplifiedProduct } from "../../../types/shopify";
import Image from "next/image";
import ImagePlaceholder from "../ImagePlaceholder";
import { AddProduct } from "../../design-system";

interface ProductCardViewProps {
  product: SimplifiedProduct;
  availableQuantity: number;
  canAddBottle: boolean;
  canAddCarton: boolean;
  isAddingBottle: boolean;
  isAddingCarton: boolean;
  onAddBottle: () => void;
  onAddCarton: () => void;
}

const BOTTLE_QUANTITY = 1;
const CARTON_QUANTITY = 6;

export default function ProductCardView({
  product,
  availableQuantity,
  canAddBottle,
  canAddCarton,
  isAddingBottle,
  isAddingCarton,
  onAddBottle,
  onAddCarton,
}: ProductCardViewProps) {
  const hasPrice = product.price ?? product.currency;

  const getStockMessage = () => {
    if (availableQuantity <= 0) {
      return "Stock épuisé";
    }
    return `${availableQuantity} bouteille${
      availableQuantity > 1 ? "s" : ""
    } disponible${availableQuantity > 1 ? "s" : ""}`;
  };

  return (
    <article
      className="bg-primary-50 rounded-md p-3 text-center flex flex-col min-h-150 group"
      aria-labelledby={`product-title-${product.id}`}
    >
      <figure className="relative flex-1 min-h-0 rounded overflow-hidden">
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

        <figcaption className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-primary-600 z-tooltip opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200">
          {getStockMessage()}
        </figcaption>

        {hasPrice && (
          <figcaption className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-primary-600 z-tooltip">
            {product.price} {product.currency}
          </figcaption>
        )}
      </figure>

      <header className="h-16 flex items-center justify-center">
        <h3
          id={`product-title-${product.id}`}
          className="text-sm text-primary-600 line-clamp-2 font-semibold"
        >
          {product.title}
        </h3>
      </header>

      <div className="flex gap-2">
        <AddProduct
          name="bottle"
          onClick={onAddBottle}
          disabled={!canAddBottle}
          loading={isAddingBottle}
          quantity={BOTTLE_QUANTITY}
          aria-label={
            canAddBottle
              ? `Ajouter 1 bouteille de ${product.title} au panier`
              : `Bouteille de ${product.title} non disponible`
          }
        />

        <AddProduct
          name="box-of-bottles"
          onClick={onAddCarton}
          disabled={!canAddCarton}
          loading={isAddingCarton}
          quantity={CARTON_QUANTITY}
          aria-label={
            canAddCarton
              ? `Ajouter 1 carton (6 bouteilles) de ${product.title} au panier`
              : `Carton de ${product.title} non disponible`
          }
        />
      </div>
    </article>
  );
}
