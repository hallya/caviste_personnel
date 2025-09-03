"use client";

import { useCallback, useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { CartService } from "../services/CartService";
import { useCartTracking } from "../tracking/useCartTracking";
import { useShopify } from "@pkg/services-shopify";
import { CART_ACTIONS } from "../utils/constants";

export function useCart() {
  const {
    cart,
    isLoading,
    isActionLoading,
    error,
    actionError,
    setCart,
    setLoading,
    setActionLoading,
    setError,
    setActionError,
    clearErrors,
    clearActionError,
  } = useCartStore();

  const { query, mutate } = useShopify();
  const tracking = useCartTracking();

  const getCartId = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cartId");
  }, []);

  const setCartId = useCallback((id: string) => {
    localStorage.setItem("cartId", id);
  }, []);

  const removeCartId = useCallback(() => {
    localStorage.removeItem("cartId");
  }, []);

  const cartService = useCallback(() => {
    return new CartService({
      query,
      mutate,
      getCartId,
      setCartId,
      removeCartId,
    });
  }, [query, mutate, getCartId, setCartId, removeCartId]);

  const addToCart = useCallback(async (variantId: string, quantity: number = 1) => {
    setActionLoading(true);
    clearActionError();

    try {
      const service = cartService();
      const cart = await service.addToCart(variantId, quantity);
      
      if (cart) {
        setCart(cart);
        tracking.trackCartAdd(variantId, quantity, cart.id);
      }
      
      return cart;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur de l'ajout de l'article";
      setActionError(errorMessage);
      tracking.trackCartError(CART_ACTIONS.ADD_TO_CART, { variant_id: variantId, quantity });
      return null;
    } finally {
      setActionLoading(false);
    }
  }, [setActionLoading, clearActionError, cartService, setCart, tracking]);

  const removeFromCart = useCallback(async (lineId: string) => {
    setActionLoading(true);
    clearActionError();

    try {
      const cartId = getCartId();
      if (!cartId) throw new Error("Panier non trouvé");

      const service = cartService();
      const cart = await service.removeFromCart(lineId);
      
      if (cart) {
        setCart(cart);
        tracking.trackCartRemove(lineId, cartId);
      }
      
      return cart;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression de l'article";
      setActionError(errorMessage);
      tracking.trackCartError(CART_ACTIONS.REMOVE_ITEM, { line_id: lineId });
      return null;
    } finally {
      setActionLoading(false);
    }
  }, [setActionLoading, clearActionError, getCartId, cartService, setCart, tracking]);

  const updateCart = useCallback(async (lineId: string, quantity: number) => {
    setActionLoading(true);
    clearActionError();

    try {
      const cartId = getCartId();
      if (!cartId) throw new Error("Panier non trouvé");

      const service = cartService();
      const cart = await service.updateCart(lineId, quantity);
      
      if (cart) {
        setCart(cart);
        tracking.trackCartUpdate(lineId, quantity, cartId);
      }
      
      return cart;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur de la mise à jour du panier";
      setActionError(errorMessage);
      tracking.trackCartError(CART_ACTIONS.UPDATE_QUANTITY, { line_id: lineId, quantity });
      return null;
    } finally {
      setActionLoading(false);
    }
  }, [setActionLoading, clearActionError, getCartId, cartService, setCart, tracking]);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    clearErrors();

    try {
      const service = cartService();
      const cart = await service.fetchCart();
      setCart(cart);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors du chargement du panier";
      setError(errorMessage);
      tracking.trackCartError(CART_ACTIONS.FETCH_CART, {
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearErrors, cartService, setCart, setError, tracking]);

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    isLoading,
    isActionLoading,
    error,
    actionError,
    
    addToCart,
    removeFromCart,
    updateCart,
    fetchCart,
    
    clearErrors,
    clearActionError,
  };
}
