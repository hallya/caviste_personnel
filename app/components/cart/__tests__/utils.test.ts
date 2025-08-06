import { calculateCartTotal, formatPrice } from '../utils';
import type { CartItem } from '../types';

describe('cart utils', () => {
  describe('calculateCartTotal', () => {
    it('calculates total for single item', () => {
      const items: CartItem[] = [
        {
          id: '1',
          title: 'Wine 1',
          price: '25.50 EUR',
          quantity: 2,
          availableForSale: true,
          quantityAvailable: 10,
        },
      ];

      const total = calculateCartTotal(items);
      expect(total).toBe('51.00 EUR');
    });

    it('calculates total for multiple items', () => {
      const items: CartItem[] = [
        {
          id: '1',
          title: 'Wine 1',
          price: '25.50 EUR',
          quantity: 2,
          availableForSale: true,
          quantityAvailable: 10,
        },
        {
          id: '2',
          title: 'Wine 2',
          price: '30.00 EUR',
          quantity: 1,
          availableForSale: true,
          quantityAvailable: 5,
        },
      ];

      const total = calculateCartTotal(items);
      expect(total).toBe('81.00 EUR');
    });

    it('handles items with decimal prices', () => {
      const items: CartItem[] = [
        {
          id: '1',
          title: 'Wine 1',
          price: '19.99 EUR',
          quantity: 3,
          availableForSale: true,
          quantityAvailable: 10,
        },
      ];

      const total = calculateCartTotal(items);
      expect(total).toBe('59.97 EUR');
    });

    it('returns default for empty cart', () => {
      const items: CartItem[] = [];

      const total = calculateCartTotal(items);
      expect(total).toBe('0.00 EUR');
    });

    it('handles items with invalid price format', () => {
      const items: CartItem[] = [
        {
          id: '1',
          title: 'Wine 1',
          price: 'Invalid price',
          quantity: 2,
          availableForSale: true,
          quantityAvailable: 10,
        },
        {
          id: '2',
          title: 'Wine 2',
          price: '25.00 EUR',
          quantity: 1,
          availableForSale: true,
          quantityAvailable: 5,
        },
      ];

      const total = calculateCartTotal(items);
      expect(total).toBe('25.00 price');
    });

    it('uses currency from first valid item', () => {
      const items: CartItem[] = [
        {
          id: '1',
          title: 'Wine 1',
          price: '25.00 USD',
          quantity: 1,
          availableForSale: true,
          quantityAvailable: 10,
        },
      ];

      const total = calculateCartTotal(items);
      expect(total).toBe('25.00 USD');
    });

    it('falls back to EUR when no valid currency found', () => {
      const items: CartItem[] = [
        {
          id: '1',
          title: 'Wine 1',
          price: 'Invalid price',
          quantity: 1,
          availableForSale: true,
          quantityAvailable: 10,
        },
      ];

      const total = calculateCartTotal(items);
      expect(total).toBe('0.00 price');
    });
  });

  describe('formatPrice', () => {
    it('formats valid price correctly', () => {
      const formatted = formatPrice('25.50 EUR');
      expect(formatted).toBe('25.50 EUR');
    });

    it('formats price with single decimal', () => {
      const formatted = formatPrice('25.5 EUR');
      expect(formatted).toBe('25.50 EUR');
    });

    it('formats price without decimals', () => {
      const formatted = formatPrice('25 EUR');
      expect(formatted).toBe('25.00 EUR');
    });

    it('handles invalid price format', () => {
      const formatted = formatPrice('Invalid price');
      expect(formatted).toBe('Invalid price');
    });

    it('handles price without currency', () => {
      const formatted = formatPrice('25.50');
      expect(formatted).toBe('25.50 EUR');
    });

    it('handles empty string', () => {
      const formatted = formatPrice('');
      expect(formatted).toBe('');
    });

    it('handles price with multiple decimals', () => {
      const formatted = formatPrice('25.567 EUR');
      expect(formatted).toBe('25.57 EUR');
    });

    it('handles zero price', () => {
      const formatted = formatPrice('0 EUR');
      expect(formatted).toBe('0.00 EUR');
    });
  });
}); 