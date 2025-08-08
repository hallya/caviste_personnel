import { renderHook, act } from '@testing-library/react';
import { useCollectionFilters } from '../hooks/useCollectionFilters';
import type { SimplifiedProduct } from '../../../types/shopify';

jest.mock('../hooks/useCollectionFilters', () => {
  const originalModule = jest.requireActual('../hooks/useCollectionFilters');
  return {
    ...originalModule,
  };
});

const mockProducts: SimplifiedProduct[] = [
  {
    id: '1',
    title: 'Vin Rouge Test',
    tags: ['vin-rouge', 'test-tag'],
    price: '15.00',
    image: null,
    currency: 'EUR',
    availableForSale: true,
  },
  {
    id: '2',
    title: 'Vin Blanc Test',
    tags: ['vin-blanc', 'test-tag'],
    price: '12.00',
    image: null,
    currency: 'EUR',
    availableForSale: true,
  },
];

describe('useCollectionFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => 
      useCollectionFilters({
        products: mockProducts,
        collectionTitle: 'Test Collection',
        collectionHandle: '', // Empty handle to avoid API calls
        collectionTags: ['collection-tag'],
      })
    );

    expect(result.current.filters.selectedTags).toEqual([]);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('should exclude collection tags from available tags', () => {
    const { result } = renderHook(() => 
      useCollectionFilters({
        products: mockProducts,
        collectionTitle: 'Test Collection',
        collectionHandle: '', // Empty to avoid API calls
        collectionTags: ['test-tag'], // This should be excluded
      })
    );

    expect(result.current.availableTags).not.toContain('test-tag');
    expect(result.current.availableTags).toContain('vin-rouge');
    expect(result.current.availableTags).toContain('vin-blanc');
  });

  it('should filter products using filters.selectedTags', () => {
    const { result } = renderHook(() => 
      useCollectionFilters({
        products: mockProducts,
        collectionTitle: 'Test Collection',
        collectionHandle: '', // Empty to avoid API calls
        collectionTags: [],
      })
    );

    // Select a tag using toggleTag
    act(() => {
      result.current.toggleTag('vin-rouge');
    });

    expect(result.current.filters.selectedTags).toContain('vin-rouge');
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].title).toBe('Vin Rouge Test');
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() => 
      useCollectionFilters({
        products: mockProducts,
        collectionTitle: 'Test Collection',
        collectionHandle: '',
        collectionTags: [],
      })
    );

    act(() => {
      result.current.toggleTag('vin-rouge');
      result.current.setSearchQuery('test query');
    });

    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.selectedTags).toEqual([]);
    expect(result.current.filters.searchQuery).toBe('');
    expect(result.current.hasActiveFilters).toBe(false);
  });
});