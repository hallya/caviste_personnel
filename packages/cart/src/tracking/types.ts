export interface CartTrackingEvent {
  name: string;
  properties: Record<string, string | number | boolean | null>;
}

export interface CartTrackingInterface {
  trackCartAdd: (variantId: string, quantity: number, cartId?: string | null) => void;
  trackCartRemove: (lineId: string, cartId: string) => void;
  trackCartUpdate: (lineId: string, quantity: number, cartId: string) => void;
  trackCartError: (action: string, properties: Record<string, string | number | boolean | null>) => void;
}
