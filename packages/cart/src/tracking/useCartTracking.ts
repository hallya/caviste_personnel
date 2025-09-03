import { useCallback } from "react";
import { useAnalytics } from "@pkg/analytics";
import { ANALYTICS_EVENTS } from "./cartTrackingEvents";
import type { CartTrackingInterface } from "./types";

export function useCartTracking(): CartTrackingInterface {
  const { track } = useAnalytics();

  const trackCartAdd = useCallback((
    variantId: string, 
    quantity: number, 
    cartId?: string | null
  ) => {
    track({
      name: ANALYTICS_EVENTS.CART_ADD,
      properties: {
        variant_id: variantId,
        quantity,
        cart_id: cartId ?? null,
      },
    });
  }, [track]);

  const trackCartRemove = useCallback((
    lineId: string, 
    cartId: string
  ) => {
    track({
      name: ANALYTICS_EVENTS.CART_REMOVE,
      properties: {
        line_id: lineId,
        cart_id: cartId,
      },
    });
  }, [track]);

  const trackCartUpdate = useCallback((
    lineId: string, 
    quantity: number, 
    cartId: string
  ) => {
    track({
      name: ANALYTICS_EVENTS.CART_UPDATE_QUANTITY,
      properties: {
        line_id: lineId,
        quantity,
        cart_id: cartId,
      },
    });
  }, [track]);

  const trackCartError = useCallback((
    action: string, 
    properties: Record<string, string | number | boolean | null>
  ) => {
    track({
      name: ANALYTICS_EVENTS.CART_ERROR,
      properties: {
        action,
        error_message: "Erreur lors de l'action du panier",
        ...properties,
      },
    });
  }, [track]);

  return {
    trackCartAdd,
    trackCartRemove,
    trackCartUpdate,
    trackCartError,
  };
}
