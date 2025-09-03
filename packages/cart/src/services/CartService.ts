import type { CartDetailed } from "@pkg/domain";
import type { CartServiceInterface, CartServiceDependencies } from "./types";
import {
  CartCreateDocument,
  CartLinesAddDocument,
  CartLinesRemoveDocument,
  CartLinesUpdateDocument,
  GetCartDetailedDocument,
  mapCartAddLinesMutationDtoToDomain,
  mapCartCreateMutationDtoToDomain,
  mapCartDetailedQueryDtoToDomain,
  mapCartLinesRemoveMutationDtoToDomain,
  mapCartLinesUpdateMutationDtoToDomain,
} from "@pkg/services-shopify";

export class CartService implements CartServiceInterface {
  constructor(private deps: CartServiceDependencies) {}

  async fetchCart(): Promise<CartDetailed | null> {
    const cartId = this.deps.getCartId();
    if (!cartId) {
      return null;
    }

    const res = await this.deps.query(GetCartDetailedDocument, { cartId });
    
    if (res.errors) {
      if (res.errors[0].extensions?.code === "NOT_FOUND") {
        this.deps.removeCartId();
        return null;
      }
      throw new Error("Erreur de connexion");
    }

    return mapCartDetailedQueryDtoToDomain(res.data);
  }

  async addToCart(variantId: string, quantity: number = 1): Promise<CartDetailed | null> {
    const cartId = this.deps.getCartId();

    if (!cartId) {
      const res = await this.deps.mutate(CartCreateDocument, {
        lines: [
          {
            merchandiseId: variantId,
            quantity,
            attributes: [],
            sellingPlanId: null,
          },
        ],
      });
      
      const cart = mapCartCreateMutationDtoToDomain(res.data);
      if (cart?.id) {
        this.deps.setCartId(cart.id);
      }
      return cart;
    }

    const res = await this.deps.mutate(CartLinesAddDocument, {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity,
          attributes: [],
          sellingPlanId: null,
        },
      ],
    });

    if (res.errors) {
      throw new Error(res.errors[0].message || "Erreur ajout panier");
    }

    return mapCartAddLinesMutationDtoToDomain(res.data);
  }

  async updateCart(lineId: string, quantity: number): Promise<CartDetailed | null> {
    const cartId = this.deps.getCartId();
    if (!cartId) throw new Error("Panier non trouvé");

    const res = await this.deps.mutate(CartLinesUpdateDocument, {
      cartId,
      lines: [
        {
          id: lineId,
          quantity,
          attributes: [],
          merchandiseId: null,
          sellingPlanId: null,
        },
      ],
    });

    if (res.errors) {
      throw new Error(res.errors[0].message || "Erreur lors de la mise à jour du panier");
    }

    return mapCartLinesUpdateMutationDtoToDomain(res.data);
  }

  async removeFromCart(lineId: string): Promise<CartDetailed | null> {
    const cartId = this.deps.getCartId();
    if (!cartId) throw new Error("Panier non trouvé");

    const res = await this.deps.mutate(CartLinesRemoveDocument, {
      cartId,
      lineIds: [lineId],
    });

    if (res.errors) {
      throw new Error(res.errors[0].message || "Erreur lors de la suppression de l'article");
    }

    return mapCartLinesRemoveMutationDtoToDomain(res.data);
  }
}
