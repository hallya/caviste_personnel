/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import CollectionsContainer from '../containers/CollectionsContainer';
import { Collection } from '../../components/carousel/types';
import { 
  CollectionsTestFactories, 
  CollectionsTestData, 
  SearchParamsFactories 
} from '../../__tests__/factories';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../../hooks/useCollections', () => ({
  useCollections: () => ({
    popupOpen: false,
    popupTitle: '',
    popupHandle: '',
    popupCollectionTags: [],
    popupProducts: [],
    popupLoading: false,
    hasNextPage: false,
    openCollection: jest.fn(),
    loadMore: jest.fn(),
    closePopup: jest.fn(),
  }),
}));

jest.mock('../views/CollectionsView', () => {
  return function MockCollectionsView(props: {
    collections: Collection[];
    searchQuery: string;
    sortBy: string;
    sortOrder: string;
    onSearchChange: (value: string) => void;
    onSortChange: (sortBy: string) => void;
    onClearFilters: () => void;
  }) {
    return (
      <div data-testid="collections-view">
        <div data-testid="collections-count">{props.collections.length}</div>
        <div data-testid="search-query">{props.searchQuery}</div>
        <div data-testid="sort-by">{props.sortBy}</div>
        <div data-testid="sort-order">{props.sortOrder}</div>
        <button 
          data-testid="search-change"
          onClick={() => props.onSearchChange('test search')}
        >
          Change Search
        </button>
        <button 
          data-testid="sort-change"
          onClick={() => props.onSortChange('handle')}
        >
          Change Sort
        </button>
        <button 
          data-testid="clear-filters"
          onClick={props.onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    );
  };
});

const mockRouter = {
  replace: jest.fn(),
};

const mockSearchParams = new URLSearchParams();

const mockCollections = CollectionsTestData.defaultCollections();

describe('CollectionsContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/collections');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('should render with initial collections and default filters', () => {
    const emptySearchParams = SearchParamsFactories.empty();

    render(
      <CollectionsContainer
        initialCollections={mockCollections}
        searchParams={emptySearchParams}
      />
    );

    expect(screen.getByTestId('collections-view')).toBeInTheDocument();
    expect(screen.getByTestId('collections-count')).toHaveTextContent('2');
    expect(screen.getByTestId('search-query')).toHaveTextContent('');
    expect(screen.getByTestId('sort-by')).toHaveTextContent('name');
    expect(screen.getByTestId('sort-order')).toHaveTextContent('asc');
  });

  it('should initialize with search params', () => {
    const searchParams = SearchParamsFactories.withAll('rouge', 'handle', 'desc');

    render(
      <CollectionsContainer
        initialCollections={mockCollections}
        searchParams={searchParams}
      />
    );

    expect(screen.getByTestId('search-query')).toHaveTextContent('rouge');
    expect(screen.getByTestId('sort-by')).toHaveTextContent('handle');
    expect(screen.getByTestId('sort-order')).toHaveTextContent('desc');
  });

  it('should update URL when filters change', async () => {
    const emptySearchParams = SearchParamsFactories.empty();

    render(
      <CollectionsContainer
        initialCollections={mockCollections}
        searchParams={emptySearchParams}
      />
    );

    fireEvent.click(screen.getByTestId('search-change'));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(
        '/collections?search=test+search',
        { scroll: false }
      );
    });
  });

  it('should clear filters when clear button is clicked', async () => {
    const searchParams = SearchParamsFactories.withAll('rouge', 'handle', 'desc');

    render(
      <CollectionsContainer
        initialCollections={mockCollections}
        searchParams={searchParams}
      />
    );

    fireEvent.click(screen.getByTestId('clear-filters'));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(
        '/collections',
        { scroll: false }
      );
    });
  });

  it('should filter collections by search query', () => {
    const searchableCollections = CollectionsTestFactories.searchableCollections();
    const searchParams = SearchParamsFactories.withSearch('rouge');

    render(
      <CollectionsContainer
        initialCollections={searchableCollections}
        searchParams={searchParams}
      />
    );

    expect(screen.getByTestId('collections-count')).toHaveTextContent('1');
  });
});