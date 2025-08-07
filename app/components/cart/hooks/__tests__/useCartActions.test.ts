import { renderHook, act } from '@testing-library/react';
import { useCartActions } from '../useCartActions';
import type { Cart } from '../../types';

global.fetch = jest.fn();

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockCart: Cart = {
  id: 'gid://shopify/Cart/123',
  totalQuantity: 2,
  totalAmount: '300.00 EUR',
  checkoutUrl: 'https://checkout.shopify.com/123',
  lines: [
    {
      id: 'gid://shopify/CartLine/1',
      title: 'Château Margaux 2018',
      price: '150.00 EUR',
      quantity: 2,
      image: 'https://example.com/wine.jpg',
      availableForSale: true,
      quantityAvailable: 10,
    },
  ],
};

describe('useCartActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('cart-123');
  });

  describe('updateQuantity', () => {
    it('successfully updates quantity', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      });

      const { result } = renderHook(() => useCartActions());

      const updatedCart = await result.current.updateQuantity('line-123', 3);

      expect(fetch).toHaveBeenCalledWith('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: 'cart-123', lineId: 'line-123', quantity: 3 }),
      });

      expect(updatedCart).toEqual(mockCart);
      expect(result.current.error).toBeNull();
    });

    it('handles cart not found', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useCartActions());

      let updatedCart: Cart | null = null;
      await act(async () => {
        updatedCart = await result.current.updateQuantity('line-123', 3);
      });

      expect(updatedCart).toBeNull();
      expect(result.current.error).toBe('Aucun panier trouvé');
    });

    it('handles API error response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Stock insuffisant' }),
      });

      const { result } = renderHook(() => useCartActions());

      let updatedCart: Cart | null = null;
      await act(async () => {
        updatedCart = await result.current.updateQuantity('line-123', 3);
      });

      expect(updatedCart).toBeNull();
      expect(result.current.error).toBe('Stock insuffisant');
    });

    it('handles network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useCartActions());

      let updatedCart: Cart | null = null;
      await act(async () => {
        updatedCart = await result.current.updateQuantity('line-123', 3);
      });

      expect(updatedCart).toBeNull();
      expect(result.current.error).toBe('Erreur de connexion');
    });

    it('sets loading state during update', async () => {
      (fetch as jest.Mock).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => mockCart,
        }), 100))
      );

      const { result } = renderHook(() => useCartActions());

      await act(async () => {
        await result.current.updateQuantity('line-123', 3);
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe('removeItem', () => {
    it('successfully removes item', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      });

      const { result } = renderHook(() => useCartActions());

      const updatedCart = await result.current.removeItem('line-123');

      expect(fetch).toHaveBeenCalledWith('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: 'cart-123', lineId: 'line-123' }),
      });

      expect(updatedCart).toEqual(mockCart);
      expect(result.current.error).toBeNull();
    });

    it('handles cart not found', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useCartActions());

      let updatedCart: Cart | null = null;
      await act(async () => {
        updatedCart = await result.current.removeItem('line-123');
      });

      expect(updatedCart).toBeNull();
      expect(result.current.error).toBe('Aucun panier trouvé');
    });

    it('handles API error response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Article non trouvé' }),
      });

      const { result } = renderHook(() => useCartActions());

      let updatedCart: Cart | null = null;
      await act(async () => {
        updatedCart = await result.current.removeItem('line-123');
      });

      expect(updatedCart).toBeNull();
      expect(result.current.error).toBe('Article non trouvé');
    });

    it('handles network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useCartActions());

      let updatedCart: Cart | null = null;
      await act(async () => {
        updatedCart = await result.current.removeItem('line-123');
      });

      expect(updatedCart).toBeNull();
      expect(result.current.error).toBe('Erreur de connexion');
    });

    it('sets loading state during removal', async () => {
      (fetch as jest.Mock).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => mockCart,
        }), 100))
      );

      const { result } = renderHook(() => useCartActions());

      await act(async () => {
        await result.current.removeItem('line-123');
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe('error handling', () => {
    it('clears error when new action starts', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'First error' }),
      });

      const { result } = renderHook(() => useCartActions());

      await act(async () => {
        await result.current.updateQuantity('line-123', 3);
      });
      expect(result.current.error).toBe('First error');

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      });

      await act(async () => {
        await result.current.updateQuantity('line-123', 4);
      });
      expect(result.current.error).toBeNull();
    });
  });
}); 