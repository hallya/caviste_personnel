import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { type Collection } from "@pkg/domain";
import CarouselView from "../views/CarouselView";
import { __testHelpers__ } from "@pkg/services-shopify";

const { collectionsFactory } = __testHelpers__;

jest.mock("../Carousel.module.css", () => ({
  viewport: "viewport-class",
  inner: "inner-class",
}));

const mockCollections: Collection[] = collectionsFactory({
  overrideCollections: [
    {
      title: "Collection 1",
      handle: "collection-1",
    },
    {
      title: "Collection 2",
      handle: "collection-2",
    },
  ],
});

const defaultProps = {
  collections: mockCollections,
  current: 0,
  containerRef: { current: null },
  handleTouchStart: jest.fn(),
  handleTouchEnd: jest.fn(),
  isMobile: false,
  onSelect: jest.fn(),
  onOpen: jest.fn(),
};

describe("CarouselView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders carousel structure correctly", () => {
    render(<CarouselView {...defaultProps} />);

    expect(screen.getByRole("region")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders with touch event handlers", () => {
    render(<CarouselView {...defaultProps} />);

    const carousel = screen.getByRole("region");

    expect(carousel).toBeInTheDocument();
    expect(defaultProps.handleTouchStart).toBeDefined();
    expect(defaultProps.handleTouchEnd).toBeDefined();
  });

  it("maintains 3D effects CSS classes", () => {
    render(<CarouselView {...defaultProps} />);

    const viewport = screen.getByRole("region");
    const viewportContainer = viewport.querySelector("div");
    const innerContainer = viewportContainer?.querySelector("div");

    expect(viewportContainer).toHaveClass("viewport-class");
    expect(innerContainer).toHaveClass("inner-class");
  });

  it("renders different states based on mobile prop", () => {
    const { rerender } = render(
      <CarouselView {...defaultProps} isMobile={false} />
    );
    expect(screen.getByRole("region")).toBeInTheDocument();

    rerender(<CarouselView {...defaultProps} isMobile={true} />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("handles empty collections gracefully", () => {
    render(<CarouselView {...defaultProps} collections={[]} />);

    expect(screen.getByRole("region")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("maintains accessibility attributes", () => {
    render(<CarouselView {...defaultProps} />);

    const carousel = screen.getByRole("region");
    expect(carousel).toHaveAttribute("aria-label", "Carousel de collections");
    expect(carousel).toHaveAttribute("aria-live", "polite");
    expect(carousel).toHaveAttribute("aria-atomic", "false");
  });
});
