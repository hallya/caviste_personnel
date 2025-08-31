import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { Product } from "@pkg/domain";
import HomeView from "../views/HomeView";
import { __testHelpers__ } from "@pkg/services-shopify";

const { productFactory } = __testHelpers__;

jest.mock("@pkg/catalog", () => {
  return {
    Popup: () => <div data-testid="popup">Popup</div>,
  };
});

jest.mock("@pkg/design-system", () => {
  return {
    IntroText: () => <div data-testid="intro-text">Intro Text</div>,
    Carousel: () => <div data-testid="carousel">Carousel</div>,
    PageHeader: () => <div data-testid="page-header">Page Header</div>,
    InstagramIcon: () => <div data-testid="instagram-icon">Instagram</div>,
    FacebookIcon: () => <div data-testid="facebook-icon">Facebook</div>,
  };
});

jest.mock("@pkg/seo", () => ({
  SOCIAL_LINKS: {
    INSTAGRAM: "https://www.instagram.com/edouard_cavistepersonnel/",
    FACEBOOK: "https://www.facebook.com/Edouard.Caviste.Personnel",
  },
}));

const mockProducts: Product[] = [
  productFactory(),
];

const defaultProps = {
  collections: [],
  collectionsLoading: false,
  collectionsError: null,
  popupOpen: false,
  popupTitle: "",
  popupHandle: "",
  popupCollectionTags: [],
  popupProducts: mockProducts,
  popupLoading: false,
  hasNextPage: false,
  onItemClick: jest.fn(),
  onLoadMore: jest.fn(),
  onClosePopup: jest.fn(),
};

describe("HomeView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all main components correctly", () => {
    render(<HomeView {...defaultProps} />);

    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(screen.getByTestId("intro-text")).toBeInTheDocument();
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("conditionally renders popup based on state", () => {
    const { rerender } = render(
      <HomeView {...defaultProps} popupOpen={false} />,
    );
    expect(screen.queryByTestId("popup")).not.toBeInTheDocument();

    rerender(<HomeView {...defaultProps} popupOpen={true} />);
    expect(screen.getByTestId("popup")).toBeInTheDocument();
  });

  it("maintains basic layout structure", () => {
    render(<HomeView {...defaultProps} />);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("bg-primary-50", "min-h-screen");
  });

  it("handles different popup states correctly", () => {
    const { rerender } = render(
      <HomeView {...defaultProps} popupOpen={false} />,
    );
    expect(screen.queryByTestId("popup")).not.toBeInTheDocument();

    rerender(
      <HomeView {...defaultProps} popupOpen={true} popupLoading={true} />,
    );
    expect(screen.getByTestId("popup")).toBeInTheDocument();
  });

  it("handles empty products gracefully", () => {
    render(<HomeView {...defaultProps} popupProducts={[]} />);

    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(screen.getByTestId("intro-text")).toBeInTheDocument();
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("maintains semantic HTML structure", () => {
    render(<HomeView {...defaultProps} />);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass(
      "bg-primary-50",
      "min-h-screen",
      "overflow-hidden",
      "touch-pan-y",
    );
  });
});
