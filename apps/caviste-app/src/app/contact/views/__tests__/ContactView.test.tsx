import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactView from "../ContactView";
import "@testing-library/jest-dom";

jest.mock("@pkg/design-system", () => ({
  PageHeader: function MockPageHeader() {
    return <header>Page Header</header>;
  },
}));

describe("ContactView", () => {
  const user = userEvent.setup();

  it("displays page content structure with proper semantic hierarchy", () => {
    render(<ContactView />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    const sections = document.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(0);

    expect(
      screen.getByRole("heading", { name: "Contact & À propos", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "À propos d'Edouard", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Me Contacter", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Mes Services", level: 3 }),
    ).toBeInTheDocument();

    const mainHeading = screen.getByRole("heading", {
      name: "Contact & À propos",
      level: 1,
    });
    const subHeadings = screen.getAllByRole("heading", { level: 2 });
    const subSubHeadings = screen.getAllByRole("heading", { level: 3 });

    expect(mainHeading).toHaveClass("text-primary-800");
    subHeadings.forEach((heading) => {
      expect(heading).toHaveClass("text-primary-700");
    });
    subSubHeadings.forEach((heading) => {
      expect(heading).toHaveClass("text-primary-600");
    });
  });

  it("displays Edouard's story and background", () => {
    render(<ContactView />);

    expect(
      screen.getByText(/Je souhaite faire découvrir à des clients/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Saint-Émilion en grand cru depuis 1750/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Château Brun, famille Brun/)).toBeInTheDocument();
    expect(screen.getByText(/créé 2 clubs œnologie/)).toBeInTheDocument();
    expect(
      screen.getByText(/Maison Plisson à Beaumarchais/),
    ).toBeInTheDocument();
  });

  it("lists available services with proper structure", () => {
    render(<ContactView />);

    expect(
      screen.getByRole("heading", { name: "Mes Services", level: 3 }),
    ).toBeInTheDocument();

    const lists = screen.getAllByRole("list");
    expect(lists.length).toBeGreaterThan(0);

    const serviceItems = screen.getAllByRole("listitem");
    expect(serviceItems.length).toBeGreaterThan(0);

    serviceItems.forEach((item) => {
      expect(item).toHaveTextContent(/\w+/);
    });

    expect(
      screen.getByText(/Sélection personnalisée de vins/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Conseils et accords mets-vins/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Formations et dégustations privées/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Livraison sur mesure/)).toBeInTheDocument();
    expect(screen.getByText(/Tarifs négociés/)).toBeInTheDocument();
  });

  it("displays business hours", () => {
    render(<ContactView />);

    expect(screen.getByText("Lundi - Vendredi : 9h - 18h")).toBeInTheDocument();
    expect(screen.getByText("Samedi : 10h - 16h")).toBeInTheDocument();
    expect(screen.getByText("Dimanche : Sur rendez-vous")).toBeInTheDocument();
  });

  it("displays updated delivery information", () => {
    render(<ContactView />);

    expect(
      screen.getByText(
        /Livraison sur Paris Centre et Île-de-France essentiellement/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Livraison gratuite à vélo sur Paris Centre à partir d'une caisse/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Livraison gratuite en main propre en Île-de-France à partir de 4 caisses/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Créneaux de livraison sur mesure/),
    ).toBeInTheDocument();
  });

  it("displays stock and availability information", () => {
    render(<ContactView />);

    expect(
      screen.getByText(/Stock de plusieurs centaines de références/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Accès à tous les vins adoubés par le guide Vert de la RVF/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/en seulement 5 jours/)).toBeInTheDocument();
  });

  it("supports keyboard navigation and accessibility", async () => {
    render(<ContactView />);

    const emailLink = screen.getByRole("link", {
      name: "edouard.dulac@gmail.com",
    });
    const phoneLink = screen.getByRole("link", { name: "+33 6 13 51 62 33" });
    const formationsLink = screen.getByRole("link", {
      name: "Formations en Œnologie",
    });

    emailLink.focus();
    expect(emailLink).toHaveFocus();
    expect(emailLink).not.toHaveClass("sr-only");
    expect(emailLink).not.toHaveAttribute("tabindex", "-1");

    await user.tab();
    expect(phoneLink).toHaveFocus();

    await user.tab();
    expect(formationsLink).toHaveFocus();

    // Test ARIA attributes
    expect(emailLink).not.toHaveAttribute("aria-hidden", "true");
    expect(phoneLink).not.toHaveAttribute("aria-hidden", "true");
    expect(emailLink).not.toHaveAttribute("tabindex", "-1");
    expect(phoneLink).not.toHaveAttribute("tabindex", "-1");
  });

  it("has accessible link descriptions", () => {
    render(<ContactView />);

    const emailLink = screen.getByRole("link", {
      name: "edouard.dulac@gmail.com",
    });
    const phoneLink = screen.getByRole("link", { name: "+33 6 13 51 62 33" });
    const formationsLink = screen.getByRole("link", {
      name: "Formations en Œnologie",
    });

    expect(emailLink).toHaveTextContent("edouard.dulac@gmail.com");
    expect(phoneLink).toHaveTextContent("+33 6 13 51 62 33");
    expect(formationsLink).toHaveTextContent("Formations en Œnologie");

    expect(emailLink).toHaveAttribute("href", "mailto:edouard.dulac@gmail.com");
    expect(phoneLink).toHaveAttribute("href", "tel:+33613516233");
    expect(formationsLink).toHaveAttribute("href", "/formations");
  });
});
