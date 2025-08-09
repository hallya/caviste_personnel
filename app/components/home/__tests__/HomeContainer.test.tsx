import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { useCollections } from "../../../hooks/useCollections";
import type { SimplifiedProduct } from "../../../types/shopify";
import type { Collection } from "../../carousel/types";
import HomeContainer from "../containers/HomeContainer";
jest.mock("../../../hooks/useCollections");
const mockUseCollections = useCollections as jest.MockedFunction<typeof useCollections>;


interface MockHomeViewProps {
  collections: Collection[];
  collectionsLoading: boolean;
  collectionsError: string | null;
  popupOpen: boolean;
  popupTitle: string;
  popupProducts: SimplifiedProduct[];
  popupLoading: boolean;
  hasNextPage: boolean;
  onItemClick: () => void;
  onLoadMore: () => void;
  onClosePopup: () => void;
}

jest.mock("../views/HomeView", () => {
  return function MockHomeView(props: MockHomeViewProps) {
    return (
      <div data-testid="home-view">
        <div data-testid="collections-loading">{props.collectionsLoading.toString()}</div>
        <div data-testid="collections-error">{props.collectionsError || "null"}</div>
        <div data-testid="popup-open">{props.popupOpen.toString()}</div>
        <div data-testid="popup-title">{props.popupTitle || "null"}</div>
        <div data-testid="popup-loading">{props.popupLoading.toString()}</div>
        <div data-testid="has-next-page">{props.hasNextPage.toString()}</div>
        <div data-testid="collections-count">{props.collections.length}</div>
        <div data-testid="products-count">{props.popupProducts.length}</div>
        <button onClick={props.onItemClick} data-testid="item-click">Item Click</button>
        <button onClick={props.onLoadMore} data-testid="load-more">Load More</button>
        <button onClick={props.onClosePopup} data-testid="close-popup">Close Popup</button>
      </div>
    );
  };
});

describe("HomeContainer", () => {
  const mockCollectionsData = {
    collections: [
      { title: "Collection 1", handle: "collection-1", image: null },
      { title: "Collection 2", handle: "collection-2", image: null },
    ] as Collection[],
    collectionsLoading: false,
    collectionsError: null,
    popupOpen: false,
    popupTitle: "",
    popupHandle: "",
    popupCollectionTags: [] as string[],
    popupProducts: [] as SimplifiedProduct[],
    popupLoading: false,
    hasNextPage: false,
    openCollection: jest.fn(),
    loadMore: jest.fn(),
    closePopup: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCollections.mockReturnValue(mockCollectionsData);
    

    Object.defineProperty(document, "title", {
      writable: true,
      value: "",
    });
  });

  it("renders HomeView with correct props", () => {
    render(<HomeContainer />);
    
    expect(screen.getByTestId("home-view")).toBeInTheDocument();
    expect(screen.getByTestId("collections-loading")).toHaveTextContent("false");
    expect(screen.getByTestId("collections-error")).toHaveTextContent("null");
    expect(screen.getByTestId("popup-open")).toHaveTextContent("false");
    expect(screen.getByTestId("collections-count")).toHaveTextContent("2");
  });

  it("sets document title on mount", () => {
    render(<HomeContainer />);
    
    expect(document.title).toBe("Edouard Caviste personnel - Vins propres de vignerons");
  });

  it("passes collections data to HomeView", () => {
    render(<HomeContainer />);
    
    expect(screen.getByTestId("collections-count")).toHaveTextContent("2");
  });

  it("passes loading state to HomeView", () => {
    mockUseCollections.mockReturnValue({
      ...mockCollectionsData,
      collectionsLoading: true,
    });
    
    render(<HomeContainer />);
    
    expect(screen.getByTestId("collections-loading")).toHaveTextContent("true");
  });

  it("passes error state to HomeView", () => {
    const errorMessage = "Failed to load collections";
    mockUseCollections.mockReturnValue({
      ...mockCollectionsData,
      collectionsError: errorMessage,
    });
    
    render(<HomeContainer />);
    
    expect(screen.getByTestId("collections-error")).toHaveTextContent(errorMessage);
  });

  it("passes popup state to HomeView", () => {
    mockUseCollections.mockReturnValue({
      ...mockCollectionsData,
      popupOpen: true,
      popupTitle: "Test Collection",
      popupProducts: [
        { 
          id: "p1", 
          title: "Product 1", 
          image: null, 
          price: "10.00", 
          currency: "EUR", 
          availableForSale: true, 
          tags: [] 
        },
        { 
          id: "p2", 
          title: "Product 2", 
          image: null, 
          price: "20.00", 
          currency: "EUR", 
          availableForSale: true, 
          tags: [] 
        },
      ] as SimplifiedProduct[],
      popupLoading: true,
      hasNextPage: true,
    });
    
    render(<HomeContainer />);
    
    expect(screen.getByTestId("popup-open")).toHaveTextContent("true");
    expect(screen.getByTestId("popup-title")).toHaveTextContent("Test Collection");
    expect(screen.getByTestId("popup-loading")).toHaveTextContent("true");
    expect(screen.getByTestId("has-next-page")).toHaveTextContent("true");
    expect(screen.getByTestId("products-count")).toHaveTextContent("2");
  });

  it("passes callback functions to HomeView", () => {
    render(<HomeContainer />);
    
    const itemClickButton = screen.getByTestId("item-click");
    const loadMoreButton = screen.getByTestId("load-more");
    const closePopupButton = screen.getByTestId("close-popup");
    
    itemClickButton.click();
    loadMoreButton.click();
    closePopupButton.click();
    
    expect(mockCollectionsData.openCollection).toHaveBeenCalledTimes(1);
    expect(mockCollectionsData.loadMore).toHaveBeenCalledTimes(1);
    expect(mockCollectionsData.closePopup).toHaveBeenCalledTimes(1);
  });

  it("handles empty collections array", () => {
    mockUseCollections.mockReturnValue({
      ...mockCollectionsData,
      collections: [],
    });
    
    render(<HomeContainer />);
    
    expect(screen.getByTestId("collections-count")).toHaveTextContent("0");
  });

  it("handles empty popup products array", () => {
    mockUseCollections.mockReturnValue({
      ...mockCollectionsData,
      popupProducts: [],
    });
    
    render(<HomeContainer />);
    
    expect(screen.getByTestId("products-count")).toHaveTextContent("0");
  });

  it("integrates correctly with useCollections hook", () => {
    render(<HomeContainer />);
    
    expect(mockUseCollections).toHaveBeenCalledTimes(1);
    expect(mockUseCollections).toHaveBeenCalledWith();
  });

  it("only sets document title once on mount", () => {
    const { rerender } = render(<HomeContainer />);
    
    expect(document.title).toBe("Edouard Caviste personnel - Vins propres de vignerons");
    

    mockUseCollections.mockReturnValue({
      ...mockCollectionsData,
      collectionsLoading: true,
    });
    
    rerender(<HomeContainer />);
    

    expect(document.title).toBe("Edouard Caviste personnel - Vins propres de vignerons");
  });
});