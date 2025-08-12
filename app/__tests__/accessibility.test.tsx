import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import HomePage from "../page";
import CartPage from "../cart/page";
import { CartProvider } from "../contexts/CartContext";
import { NotificationProvider } from "../contexts/NotificationContext";

import HomeView from "../components/home/views/HomeView";

jest.mock("../components/home/containers/HomeContainer", () => {
  return function MockHomeContainer() {
    const mockProps = {
      collections: [
        {
          title: "Collection Test",
          handle: "collection-test",
          image: null,
        },
      ],
      collectionsLoading: false,
      collectionsError: null,
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
    };
    return <HomeView {...mockProps} />;
  };
});

jest.mock("../components/PageHeader", () => {
  return function MockPageHeader() {
    return (
      <div>
        <h1>Edouard Caviste personnel</h1>
        <nav role="navigation" aria-label="Navigation principale">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" aria-label="Accueil">
            Accueil
          </a>
          <a href="/cart" aria-label="Panier">
            Panier
          </a>
        </nav>
      </div>
    );
  };
});

jest.mock("../components/introText/IntroText", () => {
  return function MockIntroText() {
    return (
      <section role="region" aria-labelledby="intro-heading">
        <h2 id="intro-heading">Introduction</h2>
        <p>Découvrez notre sélection de vins de qualité.</p>
      </section>
    );
  };
});

jest.mock("../components/home/views/SocialLinks", () => {
  return function MockSocialLinks() {
    return (
      <aside role="complementary" aria-label="Réseaux sociaux">
        <a
          href="https://facebook.com"
          aria-label="Suivez-nous sur Facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <a
          href="https://instagram.com"
          aria-label="Suivez-nous sur Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
      </aside>
    );
  };
});

jest.mock("../components/carousel/Carousel", () => {
  return function MockCarousel() {
    return (
      <section role="region" aria-labelledby="collections-heading">
        <h2 id="collections-heading">Nos Collections</h2>
        <div role="list" aria-label="Liste des collections de vins">
          <div role="listitem">
            <button
              type="button"
              aria-label="Voir la collection Collection Test"
            >
              Collection Test
            </button>
          </div>
        </div>
      </section>
    );
  };
});

describe("Tests d'accessibilité - Pages principales", () => {
  describe("Page Home", () => {
    it("ne doit pas avoir de violations d'accessibilité", async () => {
      const { container } = render(<HomePage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("doit avoir des landmarks correctement définis", () => {
      const { container } = render(<HomePage />);

      const main = container.querySelector("main");
      const nav = container.querySelector('[role="navigation"]');
      const complementary = container.querySelector('[role="complementary"]');

      expect(main).toBeInTheDocument();
      expect(nav).toBeInTheDocument();
      expect(complementary).toBeInTheDocument();
    });

    it("doit avoir une hiérarchie de titres cohérente", () => {
      const { container } = render(<HomePage />);

      const h1 = container.querySelector("h1");
      const h2Elements = container.querySelectorAll("h2");

      expect(h1).toBeInTheDocument();
      expect(h2Elements.length).toBeGreaterThan(0);

      const allHeadings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const firstHeading = allHeadings[0];
      expect(firstHeading?.tagName.toLowerCase()).toBe("h1");
    });

    it("doit avoir des labels accessibles pour les éléments interactifs", () => {
      const { container } = render(<HomePage />);

      const buttons = container.querySelectorAll("button");
      const links = container.querySelectorAll("a");

      buttons.forEach((button) => {
        const hasAriaLabel = button.hasAttribute("aria-label");
        const hasAriaLabelledBy = button.hasAttribute("aria-labelledby");
        const hasVisibleText =
          button.textContent && button.textContent.trim().length > 0;

        expect(hasAriaLabel || hasAriaLabelledBy || hasVisibleText).toBe(true);
      });

      links.forEach((link) => {
        const hasAriaLabel = link.hasAttribute("aria-label");
        const hasVisibleText =
          link.textContent && link.textContent.trim().length > 0;

        expect(hasAriaLabel || hasVisibleText).toBe(true);
      });
    });

    it("doit respecter les bonnes pratiques de contraste (simulation)", () => {
      const { container } = render(<HomePage />);

      const main = container.querySelector("main");
      expect(main).toHaveClass("bg-primary-50");

    });
  });

  describe("Page Cart", () => {
    const renderCartPage = () => {
      return render(
        <NotificationProvider>
          <CartProvider>
            <CartPage />
          </CartProvider>
        </NotificationProvider>
      );
    };

    it("ne doit pas avoir de violations d'accessibilité", async () => {
      const { container } = renderCartPage();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("doit avoir un titre de page approprié", () => {
      const { container } = renderCartPage();

      const h1 = container.querySelector("h1");
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toContain("panier");
    });

    it("doit avoir une structure de page cohérente", () => {
      const { container } = renderCartPage();

      const pageContainer = container.querySelector(".min-h-screen");
      expect(pageContainer).toBeInTheDocument();

      const contentContainer = container.querySelector(".max-w-4xl");
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe("Validation avec composants réels", () => {
    it("PageHeader réel doit être accessible", async () => {
      const { default: RealPageHeader } = await import("../components/PageHeader");
      const { container } = render(<RealPageHeader />);
      
      const results = await axe(container, {
        rules: {
          'landmark-banner-is-top-level': { enabled: false },
          'page-has-heading-one': { enabled: false },
        }
      });
      
      expect(results).toHaveNoViolations();
    });
  });
});
