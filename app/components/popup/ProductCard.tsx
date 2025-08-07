"use client";

import { useState } from "react";
import type { SimplifiedProduct } from "../../types/shopify";
import Image from "next/image";
import ImagePlaceholder from "./ImagePlaceholder";
import { useNotification } from "../../contexts/NotificationContext";
import { useCartContext } from "../../contexts/CartContext";
import { AddProduct } from "../design-system";

interface ProductCardProps {
  product: SimplifiedProduct;
}

const BOTTLE_QUANTITY = 1;
const CARTON_QUANTITY = 6;

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddingBottle, setIsAddingBottle] = useState(false);
  const [isAddingCarton, setIsAddingCarton] = useState(false);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customQuantity, setCustomQuantity] = useState(1);
  const { showNotification } = useNotification();
  const { cart, addToCart } = useCartContext();

  const cartQuantity =
    cart?.lines?.find((line) => line.variantId === product.variantId)
      ?.quantity || 0;

  const availableQuantity = (product.quantityAvailable || 0) - cartQuantity;

  const canAddBottle =
    product.variantId && availableQuantity >= BOTTLE_QUANTITY;
  const canAddCarton =
    product.variantId && availableQuantity >= CARTON_QUANTITY;
  const canAddCustom =
    product.variantId &&
    availableQuantity >= customQuantity &&
    customQuantity > 0;

  const hasPrice = product.price ?? product.currency;

  const handleAddToCart = async (
    quantity: number,
    mode: "bottle" | "carton" | "custom"
  ) => {
    const isAdding =
      mode === "carton"
        ? setIsAddingCarton
        : mode === "custom"
        ? setIsAddingCustom
        : setIsAddingBottle;
    const canAdd =
      mode === "carton"
        ? canAddCarton
        : mode === "custom"
        ? canAddCustom
        : canAddBottle;
    const modeText =
      mode === "carton"
        ? "carton"
        : mode === "custom"
        ? "bouteilles"
        : "bouteille";

    if (!canAdd) {
      showNotification({
        type: "error",
        title: "Stock insuffisant",
        message: `Stock insuffisant pour ajouter ${quantity} ${modeText} de ${product.title}`,
        autoClose: false,
      });
      return;
    }

    if (!product.variantId) {
      return;
    }

    isAdding(true);
    try {
      const result = await addToCart(product.variantId, quantity);
      if (result) {
        const isPlural = quantity > 1;
        const addedText =
          mode === "carton"
            ? isPlural
              ? "ajoutés"
              : "ajouté"
            : isPlural
            ? "ajoutées"
            : "ajoutée";

        showNotification({
          type: "success",
          title: "Produit ajouté",
          message: `${quantity} ${
            mode === "carton"
              ? "carton"
              : mode === "custom"
              ? "bouteilles"
              : "bouteille"
          } de ${product.title} ${addedText} au panier (${
            result.totalQuantity
          } article${result.totalQuantity > 1 ? "s" : ""})`,
          autoClose: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de l'ajout au panier";

      const errorWithStatus = error as Error & {
        status?: number;
        isNetworkError?: boolean;
      };
      console.error("Cart error:", {
        product: product.title,
        variantId: product.variantId,
        error: error instanceof Error ? error.message : error,
        status: errorWithStatus.status || "N/A (network error)",
        isNetworkError: errorWithStatus.isNetworkError || false,
        timestamp: new Date().toISOString(),
      });

      showNotification({
        type: "error",
        title: "Erreur d'ajout",
        message: errorMessage,
        autoClose: false,
      });
    } finally {
      isAdding(false);
    }
  };

  const handleCustomQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "") {
      setCustomQuantity(1);
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 1) {
        setCustomQuantity(numValue);
      }
    }
  };

  return (
    <article
      className="bg-primary-50 rounded-md p-3 text-center flex flex-col min-h-100"
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
          <figcaption className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-primary-600 z-tooltip">
            {product.price} {product.currency}
          </figcaption>
        )}
      </figure>

      <header className="h-16 flex items-center justify-center mb-3">
        <h3
          id={`product-title-${product.id}`}
          className="text-sm text-primary-600 line-clamp-2 font-semibold"
        >
          {product.title}
        </h3>
      </header>

      <div className="space-y-3">
        <div className="flex gap-2">
          <AddProduct
            name="bottle"
            onClick={() => handleAddToCart(BOTTLE_QUANTITY, "bottle")}
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
            onClick={() => handleAddToCart(CARTON_QUANTITY, "carton")}
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

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="number"
              min="1"
              max={availableQuantity}
              value={customQuantity}
              onChange={handleCustomQuantityChange}
              className="w-full py-2 px-3 pr-8 rounded-md text-sm border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-500 focus:outline-none"
              placeholder="Quantité"
              aria-label={`Saisir la quantité pour ${product.title}`}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                className="w-7 h-7"
                fill="currentColor"
                viewBox="0 0 1024 1024"
              >
                <g transform="matrix(0.1,0,0,-0.1,0,1024)">
                  <path d="M4636,9089C4585,9081 4550,9053 4522,8999C4500,8956 4499,8951 4502,8648C4505,8346 4505,8341 4528,8311L4551,8280L4548,7662C4545,7046 4545,7045 4522,6989C4485,6897 4427,6816 4333,6728C4119,6526 4041,6442 3984,6355C3875,6188 3809,5990 3790,5777C3776,5621 3777,1687 3791,1601C3822,1406 3977,1235 4181,1172C4229,1158 4333,1156 5100,1153C5865,1150 5973,1151 6037,1165C6224,1207 6374,1340 6437,1521L6461,1590L6460,3681C6460,5018 6456,5797 6450,5843C6421,6051 6342,6246 6219,6410C6151,6501 6086,6568 5951,6684C5838,6781 5774,6860 5726,6960L5695,7025L5692,7642L5689,8258L5715,8296L5740,8333L5740,8639C5740,8984 5737,9001 5665,9056C5635,9079 5616,9085 5566,9087C5434,9093 4672,9095 4636,9089ZM5350,7615C5350,7003 5352,6975 5406,6831C5464,6677 5550,6569 5752,6398C5922,6254 6009,6136 6064,5974C6117,5815 6115,5925 6115,3705L6115,1645L6087,1598C6069,1567 6043,1541 6012,1523L5965,1495L5165,1492C4725,1490 4341,1492 4312,1495C4246,1503 4184,1548 4153,1610C4130,1655 4130,1655 4130,2235L4129,2815L4967,2820C5616,2824 5810,2828 5827,2838C5839,2845 5861,2865 5875,2884L5900,2917L5900,4099C5900,5397 5903,5325 5839,5371L5805,5395L4968,5398L4130,5400L4130,5569C4130,5772 4141,5865 4181,5985C4237,6153 4304,6244 4508,6426C4666,6568 4734,6650 4795,6773C4884,6953 4883,6945 4887,7603L4891,8180L5350,8180L5350,7615Z" />
                </g>
              </svg>
            </div>
          </div>
          <button
            onClick={() => handleAddToCart(customQuantity, "custom")}
            disabled={isAddingCustom || !canAddCustom}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Ajouter quantité personnalisée de ${product.title} au panier`}
          >
            {isAddingCustom ? (
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {availableQuantity > 0 && (
        <p className="text-xs text-gray-600 mt-3">
          {availableQuantity} bouteille{availableQuantity > 1 ? "s" : ""}{" "}
          disponible{availableQuantity > 1 ? "s" : ""}
        </p>
      )}
    </article>
  );
}
