import { productMatchesTags, productMatchesSearch, sortProducts } from '../utils';
import type { SimplifiedProduct } from '../../../types/shopify';

const mockProduct1: SimplifiedProduct = {
  id: '1',
  title: 'Vin Rouge de Bordeaux',
  image: null,
  price: '25.00',
  currency: 'EUR',
  variantId: 'var1',
  availableForSale: true,
  quantityAvailable: 10,
  tags: ['vin-rouge', 'bordeaux', 'premium'],
};

const mockProduct2: SimplifiedProduct = {
  id: '2',
  title: 'Vin Blanc de Loire',
  image: null,
  price: '18.00',
  currency: 'EUR',
  variantId: 'var2',
  availableForSale: true,
  quantityAvailable: 5,
  tags: ['vin-blanc', 'loire', 'bio'],
};

const mockProduct3: SimplifiedProduct = {
  id: '3',
  title: 'Champagne Brut',
  image: null,
  price: '45.00',
  currency: 'EUR',
  variantId: 'var3',
  availableForSale: false,
  quantityAvailable: 0,
  tags: ['champagne', 'brut', 'celebration'],
};

describe('Filter Logic', () => {
  describe('productMatchesTags', () => {
    it('should match product with all selected tags (AND logic)', () => {
      const result = productMatchesTags(mockProduct1, ['vin-rouge', 'bordeaux']);
      expect(result).toBe(true);
    });

    it('should not match product missing one tag', () => {
      const result = productMatchesTags(mockProduct1, ['vin-rouge', 'champagne']);
      expect(result).toBe(false);
    });

    it('should match when no tags selected', () => {
      const result = productMatchesTags(mockProduct1, []);
      expect(result).toBe(true);
    });

    it('should be case insensitive', () => {
      const result = productMatchesTags(mockProduct1, ['VIN-ROUGE', 'BORDEAUX']);
      expect(result).toBe(true);
    });
  });

  describe('productMatchesSearch', () => {
    it('should match product title', () => {
      const result = productMatchesSearch(mockProduct1, 'bordeaux');
      expect(result).toBe(true);
    });

    it('should match product tags', () => {
      const result = productMatchesSearch(mockProduct1, 'premium');
      expect(result).toBe(true);
    });

    it('should be case insensitive', () => {
      const result = productMatchesSearch(mockProduct1, 'BORDEAUX');
      expect(result).toBe(true);
    });

    it('should not match unrelated search', () => {
      const result = productMatchesSearch(mockProduct1, 'champagne');
      expect(result).toBe(false);
    });

    it('should match partial words', () => {
      const result = productMatchesSearch(mockProduct1, 'bord');
      expect(result).toBe(true);
    });

    it('should return true for empty search', () => {
      const result = productMatchesSearch(mockProduct1, '');
      expect(result).toBe(true);
    });
  });

  describe('sortProducts', () => {
    const products = [mockProduct1, mockProduct2, mockProduct3];

    it('should sort by name ascending', () => {
      const sorted = sortProducts(products, 'name', 'asc');
      
      expect(sorted[0].title).toBe('Champagne Brut');
      expect(sorted[1].title).toBe('Vin Blanc de Loire');
      expect(sorted[2].title).toBe('Vin Rouge de Bordeaux');
    });

    it('should sort by name descending', () => {
      const sorted = sortProducts(products, 'name', 'desc');
      
      expect(sorted[0].title).toBe('Vin Rouge de Bordeaux');
      expect(sorted[1].title).toBe('Vin Blanc de Loire');
      expect(sorted[2].title).toBe('Champagne Brut');
    });

    it('should sort by price ascending', () => {
      const sorted = sortProducts(products, 'price', 'asc');
      
      expect(sorted[0].price).toBe('18.00'); // Vin Blanc
      expect(sorted[1].price).toBe('25.00'); // Vin Rouge
      expect(sorted[2].price).toBe('45.00'); // Champagne
    });

    it('should sort by price descending', () => {
      const sorted = sortProducts(products, 'price', 'desc');
      
      expect(sorted[0].price).toBe('45.00'); // Champagne
      expect(sorted[1].price).toBe('25.00'); // Vin Rouge
      expect(sorted[2].price).toBe('18.00'); // Vin Blanc
    });

    it('should handle products without price', () => {
      const productsWithoutPrice = [
        { ...mockProduct1, price: null },
        mockProduct2,
        mockProduct3,
      ];
      
      const sorted = sortProducts(productsWithoutPrice, 'price', 'asc');
      
      // Products without price should be at the end
      expect(sorted[2].price).toBe(null);
    });


  });
});