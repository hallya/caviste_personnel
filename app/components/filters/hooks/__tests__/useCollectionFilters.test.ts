import { renderHook } from '@testing-library/react';
import { useCollectionFilters } from '../useCollectionFilters';
import { useProductFilters } from '../useProductFilters';
import type { SimplifiedProduct } from '../../../../types/shopify';


jest.mock('../useProductFilters');
const mockUseProductFilters = useProductFilters as jest.MockedFunction<typeof useProductFilters>;


const mockFetch = jest.fn();
global.fetch = mockFetch;


const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('useCollectionFilters', () => {
  const createMockProduct = (id: string, title: string, tags: string[] = []): SimplifiedProduct => ({
    id,
    title,
    image: `https://example.com/${id}.jpg`,
    price: '25.00',
    currency: 'EUR',
    variantId: `variant-${id}`,
    availableForSale: true,
    quantityAvailable: 10,
    tags,
  });

  const mockProducts = [
    createMockProduct('1', 'Product 1', ['red', 'wine']),
    createMockProduct('2', 'Product 2', ['white', 'wine']),
    createMockProduct('3', 'Product 3', ['red', 'champagne']),
  ];

  const mockProductFiltersReturn = {
    filters: {
      selectedTags: [],
      searchQuery: '',
      sortBy: 'name' as const,
      sortOrder: 'asc' as const,
    },
    availableTags: ['red', 'white', 'wine'],
    filteredProducts: mockProducts,
    setSelectedTags: jest.fn(),
    toggleTag: jest.fn(),
    clearFilters: jest.fn(),
    hasActiveFilters: false,
    setSearchQuery: jest.fn(),
    setSortBy: jest.fn(),
    setSortOrder: jest.fn(),
    getFilteredAndSortedProducts: jest.fn(() => mockProducts),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProductFilters.mockReturnValue(mockProductFiltersReturn);
    mockFetch.mockClear();
  });

  describe('Basic Functionality', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() =>
        useCollectionFilters({
          products: mockProducts,
          collectionTitle: 'Test Collection',
          collectionHandle: '',
          collectionTags: [],
        })
      );

      expect(result.current.availableTags).toEqual(['red', 'white', 'wine']);
      expect(result.current.filteredProducts).toEqual(mockProducts);
      expect(result.current.tagsLoading).toBe(false);
      expect(result.current.tagsError).toBeNull();
    });

    it('should call useProductFilters with correct parameters', () => {
      renderHook(() =>
        useCollectionFilters({
          products: mockProducts,
          collectionTitle: 'Test Collection',
          collectionHandle: 'test-handle',
          collectionTags: ['excluded-tag'],
        })
      );

      expect(mockUseProductFilters).toHaveBeenCalledWith(
        mockProducts,
        undefined,
        ['Test Collection', 'test-handle']
      );
    });

    it('should return correct filter methods from useProductFilters', () => {
      const { result } = renderHook(() =>
        useCollectionFilters({
          products: mockProducts,
          collectionTitle: 'Test Collection',
          collectionHandle: '',
          collectionTags: [],
        })
      );

      expect(result.current.toggleTag).toBe(mockProductFiltersReturn.toggleTag);
      expect(result.current.clearFilters).toBe(mockProductFiltersReturn.clearFilters);
      expect(result.current.setSearchQuery).toBe(mockProductFiltersReturn.setSearchQuery);
      expect(result.current.setSortBy).toBe(mockProductFiltersReturn.setSortBy);
      expect(result.current.setSortOrder).toBe(mockProductFiltersReturn.setSortOrder);
    });
  });

  describe('Collection Tags Loading', () => {
    it('should not load tags when handle is empty', () => {
      renderHook(() =>
        useCollectionFilters({
          products: mockProducts,
          collectionTitle: 'Test Collection',
          collectionHandle: '',
          collectionTags: [],
        })
      );

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should trigger loading when handle is provided', () => {
      const { result } = renderHook(() =>
        useCollectionFilters({
          products: mockProducts,
          collectionTitle: 'Test Collection',
          collectionHandle: 'test-handle',
          collectionTags: [],
        })
      );

      expect(result.current.tagsLoading).toBe(true);
    });
  });

  describe('Tag Exclusion', () => {
    it('should exclude collection tags from available tags', () => {
      const { result } = renderHook(() =>
        useCollectionFilters({
          products: mockProducts,
          collectionTitle: 'Test Collection',
          collectionHandle: '',
          collectionTags: ['red'],
        })
      );

      expect(result.current.availableTags).toEqual(['white', 'wine']);
      expect(result.current.availableTags).not.toContain('red');
    });

    it('should handle case-insensitive tag exclusion', () => {
      const { result } = renderHook(() =>
        useCollectionFilters({
          products: mockProducts,
          collectionTitle: 'Test Collection',
          collectionHandle: '',
          collectionTags: ['RED', 'Wine'],
        })
      );

      expect(result.current.availableTags).toEqual(['white']);
      expect(result.current.availableTags).not.toContain('red');
      expect(result.current.availableTags).not.toContain('wine');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined collectionTags prop', () => {
      const { result } = renderHook(() =>
        useCollectionFilters({
          products: mockProducts,
          collectionTitle: 'Test Collection',
          collectionHandle: '',
          collectionTags: undefined,
        })
      );

      expect(result.current.availableTags).toEqual(['red', 'white', 'wine']);
    });

    it('should handle empty available tags', () => {
      mockUseProductFilters.mockReturnValue({
        ...mockProductFiltersReturn,
        availableTags: [],
        getFilteredAndSortedProducts: jest.fn(() => []),
      });

      const { result } = renderHook(() =>
        useCollectionFilters({
          products: [],
          collectionTitle: 'Test Collection',
          collectionHandle: '',
          collectionTags: [],
        })
      );

      expect(result.current.availableTags).toEqual([]);
    });
  });
});