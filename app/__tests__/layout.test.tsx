import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import RootLayout, { metadata } from "../layout";
jest.mock("../components/layout/Layout", () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

describe("RootLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children within Layout", () => {
    const { getByTestId, getByText } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(getByTestId("layout")).toBeInTheDocument();
    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("passes children to Layout correctly", () => {
    const { getByTestId } = render(
      <RootLayout>
        <main>Main Content</main>
        <aside>Sidebar Content</aside>
      </RootLayout>
    );

    const layout = getByTestId("layout");
    expect(layout).toContainHTML("<main>Main Content</main>");
    expect(layout).toContainHTML("<aside>Sidebar Content</aside>");
  });
});

describe("metadata", () => {
  it("has correct basic metadata", () => {
    expect(metadata.title).toBe("Edouard, Caviste personnel");
    expect(metadata.description).toBe(
      "Vins de vignerons français, sélection confidentielle, conseils personnalisés, livraison sur mesure et tarifs négociés."
    );
  });

  it("has correct icon configuration", () => {
    expect(metadata.icons).toEqual({
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
      apple: "/favicon.svg",
    });
  });

  it("has correct OpenGraph metadata", () => {
    expect(metadata.openGraph).toEqual({
      title: "Edouard, Caviste personnel",
      description: "Vins de vignerons français, sélection confidentielle, conseils personnalisés, livraison sur mesure et tarifs négociés.",
      url: "https://caviste-personnel.vercel.app",
      siteName: "Edouard, Caviste personnel",
      images: [
        {
          url: "/edouard.png",
          width: 1200,
          height: 630,
          alt: "Un homme souriant tenant un verre de vin blanc dans une cave à vin, illustration stylisée.",
        },
      ],
      locale: "fr_FR",
      type: "website",
    });
  });

  it("has correct Twitter metadata", () => {
    expect(metadata.twitter).toEqual({
      card: "summary_large_image",
      title: "Edouard, Caviste personnel",
      description: "Vins de vignerons français, sélection confidentielle, conseils personnalisés, livraison sur mesure et tarifs négociés.",
      images: ["/og-image.svg"],
    });
  });

  it("has all required SEO fields", () => {
    expect(metadata.title).toBeDefined();
    expect(metadata.description).toBeDefined();
    expect(metadata.icons).toBeDefined();
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.twitter).toBeDefined();
  });
});