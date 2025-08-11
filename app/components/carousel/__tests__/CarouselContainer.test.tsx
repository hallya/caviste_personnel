import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CarouselContainer from "../containers/CarouselContainer";
import type { Collection } from "../types";

jest.mock("../Carousel.module.css", () => ({
  viewport: "viewport-class",
  inner: "inner-class",
  item: "item-class",
  selected: "selected-class",
}));

const mockCollections: Collection[] = [
  {
    id: "gid://shopify/Collection/1",
    title: "Collection 1",
    handle: "collection-1",
    image: "https://example.com/image1.jpg",
  },
  {
    id: "gid://shopify/Collection/2",
    title: "Collection 2",
    handle: "collection-2",
    image: "https://example.com/image2.jpg",
  },
];

const renderCarouselContainer = (
  props: {
    onItemClick?: jest.Mock;
    collections?: Collection[];
    isLoading?: boolean;
    error?: string | null;
  } = {}
) => {
  return render(
    <CarouselContainer
      collections={props.collections || mockCollections}
      isLoading={props.isLoading || false}
      error={props.error || null}
      onItemClick={props.onItemClick || jest.fn()}
    />
  );
};

describe("CarouselContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state when isLoading is true", () => {
    renderCarouselContainer({ isLoading: true });

    expect(
      screen.getByText("Chargement des collections...")
    ).toBeInTheDocument();
  });

  it("renders carousel with collections when data is provided", () => {
    renderCarouselContainer();

    expect(screen.getByText("Collection 1")).toBeInTheDocument();
    expect(screen.getByText("Collection 2")).toBeInTheDocument();
  });

  it("renders error state when error is provided", () => {
    renderCarouselContainer({ error: "Network error" });

    expect(screen.getByText("Erreur de chargement")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("renders empty state when no collections", () => {
    renderCarouselContainer({ collections: [] });

    expect(
      screen.getByText("Aucune collection disponible")
    ).toBeInTheDocument();
  });

  it("maintains CSS classes for 3D effects after refactoring", () => {
    renderCarouselContainer();

    const viewport = screen.getByRole("region");
    const viewportContainer = viewport.querySelector("div");
    expect(viewportContainer).toHaveClass("viewport-class");

    const innerContainer = viewportContainer?.querySelector("div");
    expect(innerContainer).toHaveClass("inner-class");
  });

  it("calls onItemClick when collection is opened", () => {
    const onItemClick = jest.fn();
    renderCarouselContainer({ onItemClick });

    const items = screen.getAllByRole("listitem");
    const firstItem = items[0];

    act(() => {
      firstItem.click();
    });

    act(() => {
      firstItem.click();
    });

    expect(onItemClick).toHaveBeenCalledWith("collection-1", "Collection 1", undefined);
  });
});
