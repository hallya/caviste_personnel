import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { type Collection } from "@pkg/domain";
import { __testHelpers__ } from "@pkg/services-shopify";
import { CarouselItem } from "../CarouselItem";

const { collectionFactory } = __testHelpers__;

jest.mock("../Carousel.module.css", () => ({
  item: "item-class",
  selected: "selected-class",
}));

const mockCollection: Collection = collectionFactory({
  overrideCollection: {
    title: "Test Collection",
    handle: "test-collection",
    imageUrl: "https://example.com/image.jpg",
  },
});

const defaultProps = {
  collection: mockCollection,
  index: 0,
  current: 0,
  onSelect: jest.fn(),
  onOpen: jest.fn(),
  isMobile: false,
  totalItems: 3,
};

describe("CarouselItem", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders collection item with correct content", () => {
    render(<CarouselItem {...defaultProps} />);

    expect(screen.getByText("Test Collection")).toBeInTheDocument();
    expect(screen.getByAltText("Image de Test Collection")).toBeInTheDocument();
  });

  it("handles user interactions correctly", async () => {
    render(<CarouselItem {...defaultProps} current={0} />);

    const item = screen.getByRole("listitem");
    await user.click(item);

    expect(defaultProps.onOpen).toHaveBeenCalledWith(mockCollection);
  });

  it("maintains CSS classes and accessibility", () => {
    render(<CarouselItem {...defaultProps} />);

    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("item-class");
    expect(item).toHaveAttribute(
      "aria-label",
      "Collection 1 sur 3: Test Collection (sélectionnée)",
    );
  });

  it("applies selected state correctly", () => {
    render(<CarouselItem {...defaultProps} current={0} />);

    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("selected-class");
    expect(item).toHaveAttribute("aria-current", "true");
  });

  it("handles missing image gracefully", () => {
    const collectionWithoutImage = { ...mockCollection, imageUrl: null };
    render(
      <CarouselItem {...defaultProps} collection={collectionWithoutImage} />,
    );

    const placeholder = screen.getByTitle("Test Collection");
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass("bg-neutral-100");
  });

  it("maintains accessibility attributes", () => {
    render(<CarouselItem {...defaultProps} />);

    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute(
      "aria-label",
      "Collection 1 sur 3: Test Collection (sélectionnée)",
    );
    expect(item).toHaveAttribute("tabIndex", "0");
  });

  it("shows correct aria-label for non-selected items", () => {
    render(<CarouselItem {...defaultProps} current={1} />);

    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute(
      "aria-label",
      "Collection 1 sur 3: Test Collection",
    );
    expect(item).toHaveAttribute("aria-current", "false");
    expect(item).toHaveAttribute("tabIndex", "-1");
  });
});
