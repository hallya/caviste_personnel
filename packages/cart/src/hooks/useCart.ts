"use client";

import { useState, useCallback, useEffect } from "react";

import type { CartDetailed } from "@pkg/domain";
import {
  useAnalytics,
  ANALYTICS_EVENTS as __ANALYTICS_EVENTS__,
} from "@pkg/analytics";
import { CART_ACTIONS } from "../constants";
import { CartState } from "../types";
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
  useShopify,
} from "@pkg/services-shopify";

const DEFAULT_ANALYTICS_EVENTS = {
  CART_ADD: "CART_ADD",
  CART_REMOVE: "CART_REMOVE",
  CART_UPDATE_QUANTITY: "CART_UPDATE_QUANTITY",
  CART_ERROR: "CART_ERROR",
} as const;
const ANALYTICS_EVENTS = __ANALYTICS_EVENTS__ ?? DEFAULT_ANALYTICS_EVENTS;

interface UseCartReturn {
  isLoading: boolean;
  error: string | null;
  actionLoading: boolean;
  actionError: string | null;
  addToCart: (
    variantId: string,
    quantity?: number
  ) => Promise<CartDetailed | null>;
  updateCart: (
    lineId: string,
    quantity: number
  ) => Promise<CartDetailed | null>;
  removeFromCart: (lineId: string) => Promise<CartDetailed | null>;
  refetch: () => Promise<void>;
  getCartState: () => CartState;
}

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<CartDetailed | null>(null);
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const { track } = useAnalytics();
  const { query, mutate } = useShopify();

  const getCartId = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cartId");
  };

  const fetchCart = useCallback(async () => {
    preCartAction();

    try {
      const cartId = getCartId();
      if (!cartId) {
        updateCartState(null);
        postCartAction(true);
        return;
      }

      const res = await query(GetCartDetailedDocument, { cartId });
      if (res.errors) {
        if (res.errors[0].extensions?.code === "NOT_FOUND") {
          localStorage.removeFromCart("cartId");
          updateCartState(null);
          postCartAction(true);
          return;
        }
        throw new Error("Erreur de connexion");
      }

      const cart = mapCartDetailedQueryDtoToDomain(res.data);
      updateCartState(cart);
      postCartAction(true);
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      postCartAction(false, {
        action: CART_ACTIONS.FETCH_CART,
        properties: {
          error:
            error instanceof Error
              ? error.message
              : "Erreur lors du chargement du panier",
        },
      });
      setError("Erreur de connexion");
    }
  }, []);

  // Fonctions utilitaires séparées
  const preCartAction = () => {
    setActionLoading(true);
    setActionError(null);
  };

  const postCartAction = (
    success: boolean,
    errorContext?: { action: string; properties: Record<string, string | number | boolean | null> }
  ) => {
    setActionLoading(false);

    if (!success && errorContext) {
      track({
        name: ANALYTICS_EVENTS.CART_ERROR,
        properties: {
          action: errorContext.action,
          error_message: "Erreur de connexion",
          ...errorContext.properties,
        },
      });
    }
  };

  const trackAndDispatch = (
    eventName: string,
    properties: Record<string, string | number | boolean | null>
  ) => {
    track({ name: eventName, properties });
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const addToCart = async (variantId: string, quantity = 1) => {
    preCartAction();

    try {
      const cartId = getCartId();

      if (!cartId) {
        const res = await mutate(CartCreateDocument, {
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
        localStorage.setItem("cartId", cart?.id || "");
        trackAndDispatch(ANALYTICS_EVENTS.CART_ADD, {
          variant_id: variantId,
          quantity,
          cart_id: cart?.id ?? null,
        });
        postCartAction(true);
        return cart;
      }

      const res = await mutate(CartLinesAddDocument, {
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

      if (res.errors)
        throw new Error(res.errors[0].message || "Erreur ajout panier");

      const cart = mapCartAddLinesMutationDtoToDomain(res.data);
      trackAndDispatch(ANALYTICS_EVENTS.CART_ADD, {
        variant_id: variantId,
        quantity,
        cart_id: cart?.id ?? null,
      });
      postCartAction(true);
      return cart as CartDetailed;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur de connexion";
      setActionError(errorMessage);
      postCartAction(false, {
        action: CART_ACTIONS.ADD_TO_CART,
        properties: { variant_id: variantId, quantity },
      });
      return null;
    }
  };

  const updateCart = async (lineId: string, quantity: number) => {
    preCartAction();

    try {
      const cartId = getCartId();
      if (!cartId) throw new Error("Panier non trouvé");

      const res = await mutate(CartLinesUpdateDocument, {
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

      const data = mapCartLinesUpdateMutationDtoToDomain(res.data);
      if (res.errors)
        throw new Error(
          res.errors[0].message || "Erreur lors de la mise à jour du panier"
        );

      trackAndDispatch(ANALYTICS_EVENTS.CART_UPDATE_QUANTITY, {
        line_id: lineId,
        quantity,
        cart_id: cartId,
      });
      updateCartState(data);
      postCartAction(true);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur de la mise à jour du panier";
      setActionError(errorMessage);
      postCartAction(false, {
        action: CART_ACTIONS.UPDATE_QUANTITY,
        properties: { line_id: lineId, quantity },
      });
      return null;
    }
  };

  const removeFromCart = async (lineId: string) => {
    preCartAction();

    try {
      const cartId = getCartId();
      if (!cartId) throw new Error("Panier non trouvé");

      const res = await mutate(CartLinesRemoveDocument, {
        cartId,
        lineIds: [lineId],
      });

      const data = mapCartLinesRemoveMutationDtoToDomain(res.data);
      if (res.errors)
        throw new Error(
          res.errors[0].message || "Erreur lors de la suppression de l'article"
        );

      trackAndDispatch(ANALYTICS_EVENTS.CART_REMOVE, {
        line_id: lineId,
        cart_id: cartId,
      });
      updateCartState(data);
      postCartAction(true);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression de l'article";
      setActionError(errorMessage);
      postCartAction(false, {
        action: CART_ACTIONS.REMOVE_ITEM,
        properties: { line_id: lineId },
      });
      return null;
    }
  };

  const updateCartState = useCallback((newCart: CartDetailed | null) => {
    setCart(newCart);
  }, []);

  const refetch = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  const getCartState = useCallback(() => {
    return {
      cart: cart,
      isLoading,
      error,
      actionLoading,
      actionError,
    };
  }, [cart, isLoading, error, actionLoading, actionError]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    isLoading,
    error,
    actionLoading,
    actionError,
    addToCart,
    updateCart,
    removeFromCart,
    refetch,
    getCartState,
  };
}
