import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PopupContainer from '../PopupContainer';
import { useCollectionFilters } from '../../../filters/hooks/useCollectionFilters';
import type { SimplifiedProduct } from '../../../../types/shopify';


jest.mock('../../../filters/hooks/useCollectionFilters');
const mockUseCollectionFilters = useCollectionFilters as jest.MockedFunction<typeof useCollectionFilters>;


jest.mock('../../views/PopupView', () => {
  return function MockPopupView(props: {
    title: string;
    filteredProducts: SimplifiedProduct[];
    loading: boolean;
    onClose: () => void;
    onLoadMore: () => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
    tagsError?: string | null;
  }) {
    return (
      <div data-testid="popup-view">
        <span data-testid="popup-title">{props.title}</span>
        <span data-testid="products-count">{props.filteredProducts.length}</span>
        <span data-testid="loading-state">{String(props.loading)}</span>
        <button data-testid="close-button" onClick={props.onClose}>Close</button>
        <button data-testid="load-more-button" onClick={props.onLoadMore}>Load More</button>
        <input 
          data-testid="search-input" 
          value={props.searchQuery || ''} 
          onChange={(e) => props.onSearchChange?.(e.target.value)}
        />
        <button data-testid="clear-filters" onClick={props.onClearFilters}>Clear</button>
        <span data-testid="has-active-filters">{String(props.hasActiveFilters)}</span>
        <span data-testid="tags-error">{props.tagsError || 'no-error'}</span>
      </div>
    );
  };
});

describe('PopupContainer', () => {
  const mockOnClose = jest.fn();
  const mockOnLoadMore = jest.fn();
  const mockToggleTag = jest.fn();
  const mockClearFilters = jest.fn();
  const mockSetSearchQuery = jest.fn();
  const mockSetSortBy = jest.fn();
  const mockSetSortOrder = jest.fn();

  const createMockProduct = (id: string, title: string): SimplifiedProduct => ({
    id,
    title,
    image: `https://example.com/${id}.jpg`,
    price: '25.00',
    currency: 'EUR',
    variantId: `variant-${id}`,
    availableForSale: true,
    quantityAvailable: 10,
    tags: ['test-tag'],
  });

  const mockProducts = [
    createMockProduct('1', 'Product 1'),
    createMockProduct('2', 'Product 2'),
    createMockProduct('3', 'Product 3'),
  ];

  const defaultMockFiltersReturn = {
    availableTags: ['tag1', 'tag2', 'tag3'],
    filteredProducts: mockProducts,
    toggleTag: mockToggleTag,
    clearFilters: mockClearFilters,
    hasActiveFilters: false,
    setSearchQuery: mockSetSearchQuery,
    setSortBy: mockSetSortBy,
    setSortOrder: mockSetSortOrder,
    filters: {
      selectedTags: [],
      searchQuery: '',
      sortBy: 'name' as const,
      sortOrder: 'asc' as const,
    },
    tagsLoading: false,
    tagsError: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCollectionFilters.mockReturnValue(defaultMockFiltersReturn);
  });

  describe('Container Logic', () => {
    it('should initialize useCollectionFilters with correct parameters', () => {
      const collectionHandle = 'test-collection';
      const collectionTags = ['collection-tag1', 'collection-tag2'];

      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
          collectionHandle={collectionHandle}
          collectionTags={collectionTags}
        />
      );

      expect(mockUseCollectionFilters).toHaveBeenCalledWith({
        products: mockProducts,
        collectionTitle: 'Test Collection',
        collectionHandle,
        collectionTags,
      });
    });

    it('should use default values for optional props', () => {
      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      expect(mockUseCollectionFilters).toHaveBeenCalledWith({
        products: mockProducts,
        collectionTitle: 'Test Collection',
        collectionHandle: '',
        collectionTags: [],
      });
    });

    it('should pass correct props to PopupView', () => {
      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      expect(screen.getByTestId('popup-title')).toHaveTextContent('Test Collection');
      expect(screen.getByTestId('products-count')).toHaveTextContent('3');
      expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
      expect(screen.getByTestId('has-active-filters')).toHaveTextContent('false');
    });

    it('should combine loading states correctly', () => {
      mockUseCollectionFilters.mockReturnValue({
        ...defaultMockFiltersReturn,
        tagsLoading: true,
      });

      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      expect(screen.getByTestId('loading-state')).toHaveTextContent('true');
    });
  });

  describe('State Management', () => {
    it('should handle filter state updates', () => {
      mockUseCollectionFilters.mockReturnValue({
        ...defaultMockFiltersReturn,
        filters: {
          selectedTags: ['tag1'],
          searchQuery: 'test query',
          sortBy: 'price' as const,
          sortOrder: 'desc' as const,
        },
        hasActiveFilters: true,
      });

      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      expect(screen.getByTestId('search-input')).toHaveValue('test query');
      expect(screen.getByTestId('has-active-filters')).toHaveTextContent('true');
    });

    it('should handle tags error state', () => {
      const errorMessage = 'Failed to load tags';
      mockUseCollectionFilters.mockReturnValue({
        ...defaultMockFiltersReturn,
        tagsError: errorMessage,
      });

      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      expect(screen.getByTestId('tags-error')).toHaveTextContent(errorMessage);
    });

    it('should handle filtered products correctly', () => {
      const filteredProducts = [mockProducts[0], mockProducts[2]];
      mockUseCollectionFilters.mockReturnValue({
        ...defaultMockFiltersReturn,
        filteredProducts,
      });

      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      expect(screen.getByTestId('products-count')).toHaveTextContent('2');
    });
  });

  describe('User Interactions', () => {
    it('should handle close action', async () => {
      const user = userEvent.setup();

      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      await user.click(screen.getByTestId('close-button'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should handle load more action', async () => {
      const user = userEvent.setup();

      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      await user.click(screen.getByTestId('load-more-button'));
      expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
    });

    it('should handle search input changes', () => {
      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'test search' } });

      expect(mockSetSearchQuery).toHaveBeenCalledWith('test search');
    });

    it('should handle clear filters action', async () => {
      const user = userEvent.setup();

      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      await user.click(screen.getByTestId('clear-filters'));
      expect(mockClearFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close popup when Escape key is pressed', () => {
      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not close on other key presses', () => {
      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Space' });
      fireEvent.keyDown(document, { key: 'Tab' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should handle multiple escape key presses', () => {
      render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(2);
    });
  });



  describe('Event Cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = render(
        <PopupContainer
          title="Test Collection"
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty products array', () => {
      mockUseCollectionFilters.mockReturnValue({
        ...defaultMockFiltersReturn,
        filteredProducts: [],
      });

      render(
        <PopupContainer
          title="Empty Collection"
          onClose={mockOnClose}
          products={[]}
          loading={false}
          hasNext={false}
          onLoadMore={mockOnLoadMore}
        />
      );

      expect(screen.getByTestId('products-count')).toHaveTextContent('0');
    });

    it('should handle very long collection titles', () => {
      const longTitle = 'A'.repeat(200);

      render(
        <PopupContainer
          title={longTitle}
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      expect(screen.getByTestId('popup-title')).toHaveTextContent(longTitle);
    });

    it('should handle special characters in collection title', () => {
      const specialTitle = 'Collection & "Special" <Characters>';

      render(
        <PopupContainer
          title={specialTitle}
          onClose={mockOnClose}
          products={mockProducts}
          loading={false}
          hasNext={true}
          onLoadMore={mockOnLoadMore}
        />
      );

      expect(screen.getByTestId('popup-title')).toHaveTextContent(specialTitle);
    });
  });
});