import { calculateCartTotal } from '../utils';
import type { CartItem } from '../types';

const mockItems: CartItem[] = [
  {
    id: '1',
    title: 'Wine 1',
    price: '10.00 EUR',
    unitPrice: 10.00,
    currency: 'EUR',
    lineTotal: '20.00 EUR',
    quantity: 2,
    image: 'image1.jpg',
    availableForSale: true,
    quantityAvailable: 10,
    variantId: 'variant1',
  },
  {
    id: '2',
    title: 'Wine 2',
    price: '15.00 EUR',
    unitPrice: 15.00,
    currency: 'EUR',
    lineTotal: '45.00 EUR',
    quantity: 3,
    image: 'image2.jpg',
    availableForSale: true,
    quantityAvailable: 5,
    variantId: 'variant2',
  },
];

describe('calculateCartTotal', () => {
  it('should calculate total correctly for multiple items', () => {
    const total = calculateCartTotal(mockItems);
    expect(total).toBe('65.00 EUR');
  });

  it('should return 0.00 EUR for empty cart', () => {
    const total = calculateCartTotal([]);
    expect(total).toBe('0.00 EUR');
  });

  it('should handle single item', () => {
    const total = calculateCartTotal([mockItems[0]]);
    expect(total).toBe('20.00 EUR');
  });

  it('should handle items with decimal prices', () => {
    const decimalItems: CartItem[] = [
      {
        id: '3',
        title: 'Wine 3',
        price: '12.50 EUR',
        unitPrice: 12.50,
        currency: 'EUR',
        lineTotal: '25.00 EUR',
        quantity: 2,
        image: 'image3.jpg',
        availableForSale: true,
        quantityAvailable: 8,
        variantId: 'variant3',
      },
    ];
    const total = calculateCartTotal(decimalItems);
    expect(total).toBe('25.00 EUR');
  });

  it('should handle items with different currencies', () => {
    const usdItems: CartItem[] = [
      {
        id: '4',
        title: 'Wine 4',
        price: '20.00 USD',
        unitPrice: 20.00,
        currency: 'USD',
        lineTotal: '40.00 USD',
        quantity: 2,
        image: 'image4.jpg',
        availableForSale: true,
        quantityAvailable: 15,
        variantId: 'variant4',
      },
    ];
    const total = calculateCartTotal(usdItems);
    expect(total).toBe('40.00 USD');
  });

  it('should handle items with zero quantity', () => {
    const zeroQuantityItems: CartItem[] = [
      {
        id: '5',
        title: 'Wine 5',
        price: '10.00 EUR',
        unitPrice: 10.00,
        currency: 'EUR',
        lineTotal: '0.00 EUR',
        quantity: 0,
        image: 'image5.jpg',
        availableForSale: true,
        quantityAvailable: 10,
        variantId: 'variant5',
      },
    ];
    const total = calculateCartTotal(zeroQuantityItems);
    expect(total).toBe('0.00 EUR');
  });

  it('should handle items with invalid price format', () => {
    const invalidPriceItems: CartItem[] = [
      {
        id: '6',
        title: 'Wine 6',
        price: 'Invalid Price',
        unitPrice: 0,
        currency: 'EUR',
        lineTotal: '0.00 EUR',
        quantity: 2,
        image: 'image6.jpg',
        availableForSale: true,
        quantityAvailable: 10,
        variantId: 'variant6',
      },
    ];
    const total = calculateCartTotal(invalidPriceItems);
    expect(total).toBe('0.00 EUR');
  });
}); 