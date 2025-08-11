/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import CollectionsView from '../views/CollectionsView';
import { Collection } from '../../components/carousel/types';
import { CollectionsTestFactories, CollectionsTestData } from '../../__tests__/factories';

jest.mock('../../components/PageHeader', () => {
  return function MockPageHeader() {
    return <div data-testid="page-header">Collections</div>;
  };
});

jest.mock('../../components/carousel/Carousel', () => {
  return function MockCarousel({ 
    collections, 
    onItemClick 
  }: { 
    collections: Collection[], 
    onItemClick: (handle: string) => void 
  }) {
    return (
      <div data-testid="carousel">
        {collections.map((collection) => (
          <div key={collection.id}>
            <button onClick={() => onItemClick(collection.handle)}>
              {collection.title}
            </button>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../../components/popup/Popup', () => {
  return function MockPopup({ title, onClose }: { title: string, onClose: () => void }) {
    return (
      <div data-testid="popup">
        <span>{title}</span>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('../views/CollectionsFilters', () => {
  return function MockCollectionsFilters(props: {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
  }) {
    return (
      <div data-testid="collections-filters">
        <input 
          data-testid="search-input"
          value={props.searchQuery}
          onChange={(e) => props.onSearchChange(e.target.value)}
        />
        <button 
          data-testid="clear-filters-btn"
          onClick={props.onClearFilters}
          disabled={!props.hasActiveFilters}
        >
          Clear
        </button>
      </div>
    );
  };
});

const mockCollections = CollectionsTestData.defaultCollections();

const defaultProps = {
  collections: mockCollections,
  searchQuery: '',
  sortBy: 'name' as const,
  sortOrder: 'asc' as const,
  onSearchChange: jest.fn(),
  onSortChange: jest.fn(),
  onSortOrderChange: jest.fn(),
  onClearFilters: jest.fn(),
  popupOpen: false,
  popupTitle: '',
  popupHandle: '',
  popupCollectionTags: [],
  popupProducts: [],
  popupLoading: false,
  hasNextPage: false,
  onItemClick: jest.fn(),
  onLoadMore: jest.fn(),
  onClosePopup: jest.fn(),
};

describe('CollectionsView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render page header and collections', () => {
    render(<CollectionsView {...defaultProps} />);

    expect(screen.getByTestId('page-header')).toHaveTextContent('Collections');
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('collections-filters')).toBeInTheDocument();
    expect(screen.getByText('Nos Collections')).toBeInTheDocument();
  });

  it('should show empty state when no collections match search', () => {
    const emptyCollections = CollectionsTestData.emptyCollections();

    render(
      <CollectionsView 
        {...defaultProps} 
        collections={emptyCollections} 
        searchQuery="nonexistent" 
      />
    );

    expect(screen.getByText('Aucune collection trouvée pour "nonexistent"')).toBeInTheDocument();
  });

  it('should render popup when open', () => {
    const testCollection = CollectionsTestFactories.wineCollection();

    render(
      <CollectionsView 
        {...defaultProps} 
        popupOpen={true}
        popupTitle={testCollection.title}
      />
    );

    expect(screen.getByTestId('popup')).toBeInTheDocument();
    expect(screen.getAllByText(testCollection.title)).toHaveLength(2);
  });

  it('should not render popup when closed', () => {
    render(<CollectionsView {...defaultProps} />);

    expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
  });

  it('should handle search input change', () => {
    render(<CollectionsView {...defaultProps} />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test search');
  });

  it('should handle clear filters', () => {
    render(
      <CollectionsView 
        {...defaultProps} 
        searchQuery="test"
      />
    );

    const clearButton = screen.getByTestId('clear-filters-btn');
    fireEvent.click(clearButton);

    expect(defaultProps.onClearFilters).toHaveBeenCalled();
  });

  it('should handle collection item click', () => {
    render(<CollectionsView {...defaultProps} />);

    const collectionButton = screen.getByText('Vins Rouges');
    fireEvent.click(collectionButton);

    expect(defaultProps.onItemClick).toHaveBeenCalledWith('vins-rouges');
  });

  it('should handle many collections efficiently', () => {
    const manyCollections = CollectionsTestData.manyCollections(15);

    render(
      <CollectionsView 
        {...defaultProps} 
        collections={manyCollections}
      />
    );

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(manyCollections).toHaveLength(15);
  });

  it('should work with collections without images', () => {
    const collectionsWithoutImages = [
      CollectionsTestFactories.collectionWithoutImage(),
      CollectionsTestFactories.collectionWithoutVideo(),
    ];

    render(
      <CollectionsView 
        {...defaultProps} 
        collections={collectionsWithoutImages}
      />
    );

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('collections-filters')).toBeInTheDocument();
  });
});