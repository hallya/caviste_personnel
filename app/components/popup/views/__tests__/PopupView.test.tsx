import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PopupView from '../PopupView';
import type { SimplifiedProduct } from '../../../../types/shopify';
import type { SortBy, SortOrder } from '../../../filters/types';


jest.mock('../../PopupHeader', () => {
  return function MockPopupHeader({ title, onClose }: { title: string; onClose: () => void }) {
    return (
      <header data-testid="popup-header">
        <h1 id="popup-title">{title}</h1>
        <button data-testid="header-close-button" onClick={onClose}>Close</button>
      </header>
    );
  };
});

jest.mock('../../PopupFooter', () => {
  return function MockPopupFooter({ 
    hasNext, 
    loading, 
    onLoadMore, 
    gridId 
  }: {
    hasNext: boolean;
    loading: boolean;
    onLoadMore: () => void;
    gridId: string;
  }) {
    return (
      <footer data-testid="popup-footer">
        <span data-testid="footer-has-next">{String(hasNext)}</span>
        <span data-testid="footer-loading">{String(loading)}</span>
        <span data-testid="footer-grid-id">{gridId}</span>
        <button data-testid="footer-load-more" onClick={onLoadMore} disabled={loading}>
          Load More
        </button>
      </footer>
    );
  };
});

jest.mock('../../ProductCard', () => {
  return function MockProductCard({ product }: { product: SimplifiedProduct }) {
    return (
      <div data-testid={`product-card-${product.id}`} className="product-card">
        <span data-testid={`product-title-${product.id}`}>{product.title}</span>
        <span data-testid={`product-price-${product.id}`}>{product.price}</span>
      </div>
    );
  };
});

jest.mock('../../../filters/views/FilterTagsView', () => {
  return function MockFilterTagsView(props: {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    sortBy?: SortBy;
    onSortByChange?: (sortBy: SortBy) => void;
    sortOrder?: SortOrder;
    onSortOrderChange?: (order: SortOrder) => void;
    availableTags: string[];
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
  }) {
    return (
      <div data-testid="filter-tags-view">
        <input
          data-testid="filter-search-input"
          value={props.searchQuery || ''}
          onChange={(e) => props.onSearchChange?.(e.target.value)}
          placeholder="Search products..."
        />
        <select
          data-testid="filter-sort-by"
          value={props.sortBy || 'name'}
          onChange={(e) => props.onSortByChange?.(e.target.value as SortBy)}
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
        <select
          data-testid="filter-sort-order"
          value={props.sortOrder || 'asc'}
          onChange={(e) => props.onSortOrderChange?.(e.target.value as SortOrder)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <div data-testid="available-tags">
          {props.availableTags.map((tag: string) => (
            <button
              key={tag}
              data-testid={`tag-${tag}`}
              onClick={() => props.onToggleTag(tag)}
              className={props.selectedTags.includes(tag) ? 'selected' : ''}
            >
              {tag}
            </button>
          ))}
        </div>
        <button
          data-testid="clear-filters-button"
          onClick={props.onClearFilters}
          disabled={!props.hasActiveFilters}
        >
          Clear Filters
        </button>
      </div>
    );
  };
});

describe('PopupView', () => {
  const mockOnClose = jest.fn();
  const mockOnLoadMore = jest.fn();
  const mockOnToggleTag = jest.fn();
  const mockOnClearFilters = jest.fn();
  const mockOnSearchChange = jest.fn();
  const mockOnSortByChange = jest.fn();
  const mockOnSortOrderChange = jest.fn();

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

  const defaultProps = {
    title: 'Test Collection',
    onClose: mockOnClose,
    products: mockProducts,
    filteredProducts: mockProducts,
    loading: false,
    hasNext: true,
    onLoadMore: mockOnLoadMore,
    availableTags: ['tag1', 'tag2', 'tag3'],
    selectedTags: [],
    onToggleTag: mockOnToggleTag,
    onClearFilters: mockOnClearFilters,
    hasActiveFilters: false,
    searchQuery: '',
    onSearchChange: mockOnSearchChange,
    sortBy: 'name' as SortBy,
    onSortByChange: mockOnSortByChange,
    sortOrder: 'asc' as SortOrder,
    onSortOrderChange: mockOnSortOrderChange,
    collectionHandle: 'test-collection',
    tagsError: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all main sections', () => {
      render(<PopupView {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('popup-header')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('popup-footer')).toBeInTheDocument();
    });

    it('should render product grid with correct products', () => {
      render(<PopupView {...defaultProps} />);

      const productGrid = screen.getByLabelText('Liste des produits de Test Collection');
      expect(productGrid).toBeInTheDocument();

      mockProducts.forEach((product) => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`product-title-${product.id}`)).toHaveTextContent(product.title);
      });
    });

    it('should render filtered products correctly', () => {
      const filteredProducts = [mockProducts[0], mockProducts[2]];

      render(<PopupView {...defaultProps} filteredProducts={filteredProducts} />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-2')).not.toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });

    it('should render empty state when no products', () => {
      render(<PopupView {...defaultProps} filteredProducts={[]} />);

      const productGrid = screen.getByLabelText('Liste des produits de Test Collection');
      expect(productGrid).toBeInTheDocument();
      expect(productGrid).toBeEmptyDOMElement();
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(<PopupView {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'popup-title');
    });

    it('should announce loading state to screen readers', () => {
      render(<PopupView {...defaultProps} loading={true} />);

      const loadingAnnouncement = screen.getByText('Loading products…');
      expect(loadingAnnouncement).toHaveClass('sr-only');
      expect(loadingAnnouncement).toHaveAttribute('aria-live', 'polite');
    });

    it('should set aria-busy on product grid during loading', () => {
      const { rerender } = render(<PopupView {...defaultProps} loading={false} />);
      
      const productGrid = screen.getByLabelText('Liste des produits de Test Collection');
      expect(productGrid).toHaveAttribute('aria-busy', 'false');

      rerender(<PopupView {...defaultProps} loading={true} />);
      expect(productGrid).toHaveAttribute('aria-busy', 'true');
    });

    it('should have proper heading structure', () => {
      render(<PopupView {...defaultProps} />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Test Collection');
      expect(title).toHaveAttribute('id', 'popup-title');
    });

    it('should have proper landmark roles', () => {
      render(<PopupView {...defaultProps} />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByLabelText('Liste des produits de Test Collection')).toHaveAttribute('aria-label');
    });
  });

  describe('User Interactions', () => {
    it('should handle close action from header', async () => {
      const user = userEvent.setup();

      render(<PopupView {...defaultProps} />);

      await user.click(screen.getByTestId('header-close-button'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should handle load more action', async () => {
      const user = userEvent.setup();

      render(<PopupView {...defaultProps} />);

      await user.click(screen.getByTestId('footer-load-more'));
      expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
    });

    it('should handle search input changes', () => {
      render(<PopupView {...defaultProps} />);

      const searchInput = screen.getByTestId('filter-search-input');
      fireEvent.change(searchInput, { target: { value: 'test query' } });

      expect(mockOnSearchChange).toHaveBeenCalledWith('test query');
    });

    it('should handle sort by changes', async () => {
      const user = userEvent.setup();

      render(<PopupView {...defaultProps} />);

      const sortBySelect = screen.getByTestId('filter-sort-by');
      await user.selectOptions(sortBySelect, 'price');

      expect(mockOnSortByChange).toHaveBeenCalledWith('price');
    });

    it('should handle sort order changes', async () => {
      const user = userEvent.setup();

      render(<PopupView {...defaultProps} />);

      const sortOrderSelect = screen.getByTestId('filter-sort-order');
      await user.selectOptions(sortOrderSelect, 'desc');

      expect(mockOnSortOrderChange).toHaveBeenCalledWith('desc');
    });

    it('should handle tag toggle', async () => {
      const user = userEvent.setup();

      render(<PopupView {...defaultProps} />);

      await user.click(screen.getByTestId('tag-tag1'));
      expect(mockOnToggleTag).toHaveBeenCalledWith('tag1');
    });

    it('should handle clear filters action', async () => {
      const user = userEvent.setup();

      render(<PopupView {...defaultProps} hasActiveFilters={true} />);

      await user.click(screen.getByTestId('clear-filters-button'));
      expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading States', () => {
    it('should show loading announcement when loading', () => {
      render(<PopupView {...defaultProps} loading={true} />);

      expect(screen.getByText('Loading products…')).toBeInTheDocument();
    });

    it('should not show loading text when not loading', () => {
      render(<PopupView {...defaultProps} loading={false} />);

      expect(screen.queryByText('Loading products…')).not.toBeInTheDocument();
    });

    it('should pass loading state to footer', () => {
      render(<PopupView {...defaultProps} loading={true} />);

      expect(screen.getByTestId('footer-loading')).toHaveTextContent('true');
    });

    it('should disable load more button when loading', () => {
      render(<PopupView {...defaultProps} loading={true} />);

      expect(screen.getByTestId('footer-load-more')).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display tags error when present', () => {
      const errorMessage = 'Failed to load tags from server';

      render(<PopupView {...defaultProps} tagsError={errorMessage} />);

      const errorContainer = screen.getByText(/Error loading tags:/);
      expect(errorContainer).toBeInTheDocument();
      expect(errorContainer).toHaveTextContent(`Error loading tags: ${errorMessage}`);
    });

    it('should not display error container when no error', () => {
      render(<PopupView {...defaultProps} tagsError={null} />);

      expect(screen.queryByText(/Error loading tags:/)).not.toBeInTheDocument();
    });

    it('should apply error styling to error message', () => {
      render(<PopupView {...defaultProps} tagsError="Test error" />);

      const errorContainer = screen.getByText(/Error loading tags:/).closest('div');
      expect(errorContainer).toHaveClass('bg-red-50', 'border-red-200');
      
      const errorText = screen.getByText(/Error loading tags:/);
      expect(errorText).toHaveClass('text-red-700');
    });
  });

  describe('Visual Layout', () => {
    it('should apply correct CSS classes for layout', () => {
      render(<PopupView {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass(
        'fixed',
        'top-0',
        'left-0',
        'w-screen',
        'h-screen',
        'bg-black/60',
        'flex',
        'justify-center',
        'items-center',
        'z-modal',
        'animate-fadeIn'
      );
    });

    it('should apply responsive classes', () => {
      render(<PopupView {...defaultProps} />);

      const container = screen.getByRole('dialog').firstElementChild;
      expect(container).toHaveClass('w-[95vw]', 'max-w-[90vw]', 'h-[80vh]');
    });

    it('should use correct grid layout for products', () => {
      render(<PopupView {...defaultProps} />);

      const productGrid = screen.getByLabelText('Liste des produits de Test Collection');
      expect(productGrid).toHaveClass(
        'grid',
        'gap-4',
        'auto-rows-fr',
        'grid-cols-[repeat(auto-fill,minmax(200px,1fr))]',
        'max-w-full'
      );
    });
  });

  describe('Props Integration', () => {
    it('should pass all filter props to FilterTagsView', () => {
      const props = {
        ...defaultProps,
        availableTags: ['custom-tag1', 'custom-tag2'],
        selectedTags: ['custom-tag1'],
        hasActiveFilters: true,
        searchQuery: 'custom search',
        sortBy: 'price' as SortBy,
        sortOrder: 'desc' as SortOrder,
      };

      render(<PopupView {...props} />);

      expect(screen.getByTestId('filter-search-input')).toHaveValue('custom search');
      expect(screen.getByTestId('filter-sort-by')).toHaveValue('price');
      expect(screen.getByTestId('filter-sort-order')).toHaveValue('desc');
      expect(screen.getByTestId('tag-custom-tag1')).toHaveClass('selected');
      expect(screen.getByTestId('clear-filters-button')).not.toBeDisabled();
    });

    it('should pass correct props to footer', () => {
      render(<PopupView {...defaultProps} hasNext={false} loading={true} />);

      expect(screen.getByTestId('footer-has-next')).toHaveTextContent('false');
      expect(screen.getByTestId('footer-loading')).toHaveTextContent('true');
      expect(screen.getByTestId('footer-grid-id')).toHaveTextContent('collection-products-grid');
    });

    it('should use default values for optional props', () => {
      const minimalProps = {
        title: 'Minimal Test',
        onClose: mockOnClose,
        products: mockProducts,
        filteredProducts: mockProducts,
        loading: false,
        hasNext: false,
        onLoadMore: mockOnLoadMore,
        availableTags: [],
        selectedTags: [],
        onToggleTag: mockOnToggleTag,
        onClearFilters: mockOnClearFilters,
        hasActiveFilters: false,
      };

      render(<PopupView {...minimalProps} />);

      expect(screen.getByTestId('filter-search-input')).toHaveValue('');
      expect(screen.getByTestId('filter-sort-by')).toHaveValue('name');
      expect(screen.getByTestId('filter-sort-order')).toHaveValue('asc');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long collection titles', () => {
      const longTitle = 'A'.repeat(200);

      render(<PopupView {...defaultProps} title={longTitle} />);

      expect(screen.getByRole('heading')).toHaveTextContent(longTitle);
    });

    it('should handle empty available tags', () => {
      render(<PopupView {...defaultProps} availableTags={[]} />);

      const tagsContainer = screen.getByTestId('available-tags');
      expect(tagsContainer).toBeEmptyDOMElement();
    });

    it('should handle large number of products', () => {
      const manyProducts = Array.from({ length: 100 }, (_, i) => 
        createMockProduct(`product-${i}`, `Product ${i}`)
      );

      render(<PopupView {...defaultProps} filteredProducts={manyProducts} />);

      manyProducts.forEach((product) => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
      });
    });

    it('should handle special characters in search query', () => {
      const specialQuery = 'search with "quotes" & <special> characters';

      render(<PopupView {...defaultProps} searchQuery={specialQuery} />);

      expect(screen.getByTestId('filter-search-input')).toHaveValue(specialQuery);
    });
  });
});