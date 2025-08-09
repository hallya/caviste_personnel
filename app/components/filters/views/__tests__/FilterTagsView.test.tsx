import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterTagsView from '../FilterTagsView';
import type { FilterTagsViewProps } from '../../types';


jest.mock('../../../design-system/icons', () => ({
  SortIcon: function MockSortIcon(props: React.ComponentProps<'div'>) {
    return <div data-testid="sort-icon" {...props} />;
  },
  SortOrderIcon: function MockSortOrderIcon(props: React.ComponentProps<'div'>) {
    return <div data-testid="sort-order-icon" {...props} />;
  },
  SearchIcon: function MockSearchIcon(props: React.ComponentProps<'div'>) {
    return <div data-testid="search-icon" {...props} />;
  },
  ClearIcon: function MockClearIcon(props: React.ComponentProps<'div'>) {
    return <div data-testid="clear-icon" {...props} />;
  },
}));

describe('FilterTagsView', () => {
  const mockOnToggleTag = jest.fn();
  const mockOnClearFilters = jest.fn();
  const mockOnSearchChange = jest.fn();
  const mockOnSortByChange = jest.fn();
  const mockOnSortOrderChange = jest.fn();

  const defaultProps: FilterTagsViewProps = {
    availableTags: ['tag1', 'tag2', 'tag3'],
    selectedTags: [],
    onToggleTag: mockOnToggleTag,
    onClearFilters: mockOnClearFilters,
    hasActiveFilters: false,
    searchQuery: '',
    onSearchChange: mockOnSearchChange,
    sortBy: 'name',
    onSortByChange: mockOnSortByChange,
    sortOrder: 'asc',
    onSortOrderChange: mockOnSortOrderChange,
    showSearch: true,
    showSort: true,
    showTags: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all sections when enabled', () => {
      render(<FilterTagsView {...defaultProps} />);

      expect(screen.getByPlaceholderText('Rechercher un produit...')).toBeInTheDocument();
      expect(screen.getByTitle('Trier par')).toBeInTheDocument();
      expect(screen.getByTitle('Ordre de tri')).toBeInTheDocument();
      expect(screen.getByText('Filtres par tags')).toBeInTheDocument();
    });

    it('should render tags correctly', () => {
      render(<FilterTagsView {...defaultProps} />);

      defaultProps.availableTags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('should return null when all sections are disabled', () => {
      const { container } = render(
        <FilterTagsView
          {...defaultProps}
          showSearch={false}
          showSort={false}
          showTags={false}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Search Section', () => {
    it('should render search input when showSearch is true', () => {
      render(<FilterTagsView {...defaultProps} showSearch={true} />);

      expect(screen.getByPlaceholderText('Rechercher un produit...')).toBeInTheDocument();
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });

    it('should not render search input when showSearch is false', () => {
      render(<FilterTagsView {...defaultProps} showSearch={false} />);

      expect(screen.queryByPlaceholderText('Rechercher un produit...')).not.toBeInTheDocument();
    });

    it('should not render search input when onSearchChange is not provided', () => {
      render(<FilterTagsView {...defaultProps} onSearchChange={undefined} />);

      expect(screen.queryByPlaceholderText('Rechercher un produit...')).not.toBeInTheDocument();
    });

    it('should handle search input changes', () => {
      render(<FilterTagsView {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Rechercher un produit...');
      fireEvent.change(searchInput, { target: { value: 'test search' } });

      expect(mockOnSearchChange).toHaveBeenCalledWith('test search');
    });

    it('should display current search query', () => {
      render(<FilterTagsView {...defaultProps} searchQuery="current query" />);

      const searchInput = screen.getByPlaceholderText('Rechercher un produit...');
      expect(searchInput).toHaveValue('current query');
    });

    it('should apply correct CSS classes to search input', () => {
      render(<FilterTagsView {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Rechercher un produit...');
      expect(searchInput).toHaveClass(
        'w-full',
        'pl-10',
        'pr-4',
        'py-2',
        'border',
        'border-neutral-300',
        'rounded-lg',
        'focus:ring-2',
        'focus:ring-primary-500',
        'focus:border-transparent',
        'bg-white'
      );
    });
  });

  describe('Sort Section', () => {
    it('should render sort controls when showSort is true', () => {
      render(<FilterTagsView {...defaultProps} showSort={true} />);

      expect(screen.getByTitle('Trier par')).toBeInTheDocument();
      expect(screen.getByTitle('Ordre de tri')).toBeInTheDocument();
      expect(screen.getByTestId('sort-icon')).toBeInTheDocument();
      expect(screen.getByTestId('sort-order-icon')).toBeInTheDocument();
    });

    it('should not render sort controls when showSort is false', () => {
      render(<FilterTagsView {...defaultProps} showSort={false} />);

      expect(screen.queryByTitle('Trier par')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Ordre de tri')).not.toBeInTheDocument();
    });

    it('should not render sort controls when callbacks are missing', () => {
      render(
        <FilterTagsView
          {...defaultProps}
          onSortByChange={undefined}
          onSortOrderChange={undefined}
        />
      );

      expect(screen.queryByTitle('Trier par')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Ordre de tri')).not.toBeInTheDocument();
    });

    it('should handle sort by changes', async () => {
      const user = userEvent.setup();

      render(<FilterTagsView {...defaultProps} />);

      const sortBySelect = screen.getByTitle('Trier par');
      await user.selectOptions(sortBySelect, 'price');

      expect(mockOnSortByChange).toHaveBeenCalledWith('price');
    });

    it('should handle sort order changes', async () => {
      const user = userEvent.setup();

      render(<FilterTagsView {...defaultProps} />);

      const sortOrderSelect = screen.getByTitle('Ordre de tri');
      await user.selectOptions(sortOrderSelect, 'desc');

      expect(mockOnSortOrderChange).toHaveBeenCalledWith('desc');
    });

    it('should display current sort values', () => {
      render(<FilterTagsView {...defaultProps} sortBy="price" sortOrder="desc" />);

      expect(screen.getByTitle('Trier par')).toHaveValue('price');
      expect(screen.getByTitle('Ordre de tri')).toHaveValue('desc');
    });

    it('should render all sort options', () => {
      render(<FilterTagsView {...defaultProps} />);

      expect(screen.getByText('Nom')).toBeInTheDocument();
      expect(screen.getByText('Prix')).toBeInTheDocument();
      expect(screen.getByText('Croissant')).toBeInTheDocument();
      expect(screen.getByText('Décroissant')).toBeInTheDocument();
    });
  });

  describe('Tags Section', () => {
    it('should render tags section when showTags is true and tags are available', () => {
      render(<FilterTagsView {...defaultProps} showTags={true} />);

      expect(screen.getByText('Filtres par tags')).toBeInTheDocument();
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.getByText('tag3')).toBeInTheDocument();
    });

    it('should not render tags section when showTags is false', () => {
      render(<FilterTagsView {...defaultProps} showTags={false} />);

      expect(screen.queryByText('Filtres par tags')).not.toBeInTheDocument();
    });

    it('should not render tags section when no tags are available', () => {
      render(<FilterTagsView {...defaultProps} availableTags={[]} />);

      expect(screen.queryByText('Filtres par tags')).not.toBeInTheDocument();
    });

    it('should handle tag toggle', async () => {
      const user = userEvent.setup();

      render(<FilterTagsView {...defaultProps} />);

      await user.click(screen.getByText('tag1'));

      expect(mockOnToggleTag).toHaveBeenCalledWith('tag1');
    });

    it('should apply correct styling to selected tags', () => {
      render(<FilterTagsView {...defaultProps} selectedTags={['tag1']} />);

      const selectedTag = screen.getByText('tag1');
      const unselectedTag = screen.getByText('tag2');

      expect(selectedTag).toHaveClass('bg-primary-600', 'text-white', 'border-primary-600');
      expect(unselectedTag).toHaveClass('bg-white', 'text-neutral-700', 'border-neutral-300');
    });

    it('should show clear filters button when filters are active', () => {
      render(<FilterTagsView {...defaultProps} hasActiveFilters={true} />);

      expect(screen.getByText('Effacer')).toBeInTheDocument();
      expect(screen.getByTitle('Effacer les filtres')).toBeInTheDocument();
      expect(screen.getByTestId('clear-icon')).toBeInTheDocument();
    });

    it('should not show clear filters button when no active filters', () => {
      render(<FilterTagsView {...defaultProps} hasActiveFilters={false} />);

      expect(screen.queryByText('Effacer')).not.toBeInTheDocument();
    });

    it('should handle clear filters action', async () => {
      const user = userEvent.setup();

      render(<FilterTagsView {...defaultProps} hasActiveFilters={true} />);

      await user.click(screen.getByText('Effacer'));

      expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels and titles for controls', () => {
      render(<FilterTagsView {...defaultProps} hasActiveFilters={true} />);

      expect(screen.getByTitle('Trier par')).toBeInTheDocument();
      expect(screen.getByTitle('Ordre de tri')).toBeInTheDocument();
      expect(screen.getByTitle('Effacer les filtres')).toBeInTheDocument();
    });

    it('should support keyboard navigation for tags', async () => {
      const user = userEvent.setup();

      render(<FilterTagsView {...defaultProps} />);

      const tagButton = screen.getByText('tag1');
      tagButton.focus();
      
      await user.keyboard('{Enter}');
      expect(mockOnToggleTag).toHaveBeenCalledWith('tag1');

      await user.keyboard('{Space}');
      expect(mockOnToggleTag).toHaveBeenCalledWith('tag1');
    });

    it('should have semantic heading for tags section', () => {
      render(<FilterTagsView {...defaultProps} />);

      const heading = screen.getByText('Filtres par tags');
      expect(heading.tagName).toBe('H3');
    });
  });

  describe('Visual Layout', () => {
    it('should apply correct container classes', () => {
      const { container } = render(<FilterTagsView {...defaultProps} />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('mb-6', 'space-y-4');
    });

    it('should use flexbox layout for sort controls', () => {
      render(<FilterTagsView {...defaultProps} />);

      const sortContainer = screen.getByTitle('Trier par').closest('.flex');
      expect(sortContainer).toHaveClass('flex', 'items-center', 'gap-2');
    });

    it('should use flex-wrap for tags layout', () => {
      render(<FilterTagsView {...defaultProps} />);

      const tagsContainer = screen.getByText('tag1').parentElement;
      expect(tagsContainer).toHaveClass('flex', 'flex-wrap', 'gap-2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty available tags array', () => {
      render(<FilterTagsView {...defaultProps} availableTags={[]} />);

      expect(screen.queryByText('Filtres par tags')).not.toBeInTheDocument();
    });

    it('should handle tags with special characters', () => {
      const specialTags = ['tag-with-dash', 'tag_with_underscore', 'tag with spaces', 'tag&special'];
      
      render(<FilterTagsView {...defaultProps} availableTags={specialTags} />);

      specialTags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('should handle very long tag names', () => {
      const longTag = 'a'.repeat(100);
      
      render(<FilterTagsView {...defaultProps} availableTags={[longTag]} />);

      expect(screen.getByText(longTag)).toBeInTheDocument();
    });

    it('should handle many tags', () => {
      const manyTags = Array.from({ length: 50 }, (_, i) => `tag${i + 1}`);
      
      render(<FilterTagsView {...defaultProps} availableTags={manyTags} />);

      manyTags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('should handle all tags being selected', () => {
      const allTags = ['tag1', 'tag2', 'tag3'];
      
      render(<FilterTagsView {...defaultProps} selectedTags={allTags} />);

      allTags.forEach((tag) => {
        const tagButton = screen.getByText(tag);
        expect(tagButton).toHaveClass('bg-primary-600', 'text-white');
      });
    });

    it('should handle missing default values gracefully', () => {
      const minimalProps = {
        availableTags: ['tag1'],
        onToggleTag: mockOnToggleTag,
        onClearFilters: mockOnClearFilters,
        hasActiveFilters: false,
      };

      render(<FilterTagsView {...minimalProps} />);

      expect(screen.getByText('tag1')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle rapid tag clicks', async () => {
      const user = userEvent.setup();

      render(<FilterTagsView {...defaultProps} />);

      const tag1 = screen.getByText('tag1');
      const tag2 = screen.getByText('tag2');

      await user.click(tag1);
      await user.click(tag2);
      await user.click(tag1);

      expect(mockOnToggleTag).toHaveBeenCalledTimes(3);
      expect(mockOnToggleTag).toHaveBeenNthCalledWith(1, 'tag1');
      expect(mockOnToggleTag).toHaveBeenNthCalledWith(2, 'tag2');
      expect(mockOnToggleTag).toHaveBeenNthCalledWith(3, 'tag1');
    });

    it('should handle form submissions correctly', () => {
      render(<FilterTagsView {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Rechercher un produit...');
      
      fireEvent.submit(searchInput.closest('form') || searchInput);

      
      expect(mockOnSearchChange).not.toHaveBeenCalled();
    });

    it('should handle focus and blur events', async () => {
      const user = userEvent.setup();

      render(<FilterTagsView {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Rechercher un produit...');
      
      await user.click(searchInput);
      expect(searchInput).toHaveFocus();

      await user.tab();
      expect(searchInput).not.toHaveFocus();
    });
  });
});