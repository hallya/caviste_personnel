/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import type { Collection } from "@pkg/domain";
import CollectionsView, {
  CollectionsViewProps,
} from "../views/CollectionsView";
import { __testHelpers__ } from "@pkg/services-shopify";

const { collectionsFactory } = __testHelpers__;

jest.mock("@pkg/design-system", () => ({
  PageHeader: function MockPageHeader() {
    return <div data-testid="page-header">Collections</div>;
  },
  Carousel: function MockCarousel({
    collections,
    onItemClick,
  }: {
    collections: Collection[];
    onItemClick: (handle: string) => void;
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
  },
}));

jest.mock("@pkg/catalog", () => ({
  Popup: function MockPopup({
    title,
    onClose,
  }: {
    title: string;
    onClose: () => void;
  }) {
    return (
      <div data-testid="popup">
        <span>{title}</span>
        <button onClick={onClose}>Close</button>
      </div>
    );
  },
}));

jest.mock("../views/CollectionsFilters", () => {
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

const mockCollections: Collection[] = collectionsFactory();

const defaultProps: CollectionsViewProps = {
  collections: mockCollections,
  searchQuery: "",
  sortBy: "name" as const,
  sortOrder: "asc" as const,
  onSearchChange: jest.fn(),
  onSortChange: jest.fn(),
  onSortOrderChange: jest.fn(),
  onClearFilters: jest.fn(),
  popupOpen: false,
  popupTitle: "",
  popupHandle: "",
  popupCollectionTags: [],
  popupProducts: [],
  popupLoading: false,
  hasNextPage: false,
  onItemClick: jest.fn(),
  onLoadMore: jest.fn(),
  onClosePopup: jest.fn(),
  loading: false,
  error: null,
};

describe("CollectionsView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render page header, collections carousel and filters section", () => {
    render(<CollectionsView {...defaultProps} />);

    expect(screen.getByTestId("page-header")).toHaveTextContent("Collections");
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
    expect(screen.getByTestId("collections-filters")).toBeInTheDocument();
    expect(screen.getByText("Nos Collections")).toBeInTheDocument();
  });

  it('should display "no results" message when search returns empty collections', () => {
    const emptyCollections: Collection[] = [];

    render(
      <CollectionsView
        {...defaultProps}
        collections={emptyCollections}
        searchQuery="nonexistent"
      />
    );

    expect(
      screen.getByText('Aucune collection trouvée pour "nonexistent"')
    ).toBeInTheDocument();
  });

  it("should render popup when open", () => {
    const title = "Title";
    render(
      <CollectionsView {...defaultProps} popupOpen={true} popupTitle={title} />
    );

    expect(screen.getByTestId("popup")).toBeInTheDocument();
    expect(screen.getAllByText(title)).toHaveLength(2);
  });

  it("should not render popup when closed", () => {
    render(<CollectionsView {...defaultProps} />);

    expect(screen.queryByTestId("popup")).not.toBeInTheDocument();
  });

  it("should call onSearchChange when user types in search input", () => {
    render(<CollectionsView {...defaultProps} />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("test search");
  });

  it("should call onClearFilters when user clicks clear filters button", () => {
    render(<CollectionsView {...defaultProps} searchQuery="test" />);

    const clearButton = screen.getByTestId("clear-filters-btn");
    fireEvent.click(clearButton);

    expect(defaultProps.onClearFilters).toHaveBeenCalled();
  });

  it("should call onItemClick when user clicks on collection item", () => {
    render(<CollectionsView {...defaultProps} />);

    const collectionButton = screen.getByText("Vins Rouges");
    fireEvent.click(collectionButton);

    expect(defaultProps.onItemClick).toHaveBeenCalledWith("vins-rouges");
  });

  it("should render carousel efficiently with many collections", () => {
    const manyCollections = collectionsFactory({ length: 15 });

    render(<CollectionsView {...defaultProps} collections={manyCollections} />);

    expect(screen.getByTestId("carousel")).toBeInTheDocument();
    expect(manyCollections).toHaveLength(15);
  });

  it("should handle collections without images gracefully", () => {
    const collectionsWithoutImages = collectionsFactory({
      overrideCollections: [{ imageUrl: null }, { videoUrl: null }],
    });

    render(
      <CollectionsView
        {...defaultProps}
        collections={collectionsWithoutImages}
      />
    );

    expect(screen.getByTestId("carousel")).toBeInTheDocument();
    expect(screen.getByTestId("collections-filters")).toBeInTheDocument();
  });
});
