import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CartContent from "../views/CartContent";
import { __testHelpers__ } from "@pkg/services-shopify";

const { cartDetailedFactory } = __testHelpers__;

describe("CartContent Accessibility", () => {
  const user = userEvent.setup();
  const mockOnQuantityChange = jest.fn();
  const mockOnRemoveItem = jest.fn();
  const mockOnCheckout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderCartContent = (overrides = {}) => {
    const defaultProps = {
      cart: cartDetailedFactory(),
      actionLoading: false,
      onQuantityChange: mockOnQuantityChange,
      onRemoveItem: mockOnRemoveItem,
      onCheckout: mockOnCheckout,
      ...overrides,
    };

    return render(<CartContent {...defaultProps} />);
  };

  it("focuses title on mount", async () => {
    renderCartContent();

    const title = screen.getByRole("heading", { name: "Votre panier" });
    expect(title).toHaveFocus();
  });

  it("has proper ARIA attributes for total", () => {
    renderCartContent();

    const total = screen.getByText("300.00 EUR", {
      selector: 'span[aria-live="polite"]',
    });
    expect(total).toHaveAttribute("aria-live", "polite");
    expect(total).toHaveAttribute("aria-atomic", "true");
  });

  it("has proper semantic structure", () => {
    renderCartContent();

    expect(
      screen.getByRole("heading", { name: "Votre panier" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /actions du panier/i }),
    ).toBeInTheDocument();
  });

  it("announces item removal", async () => {
    renderCartContent();

    const removeButton = screen.getByRole("button", { name: /supprimer/i });
    await user.click(removeButton);

    const announcement = screen.getByText(/supprimé du panier/i);
    expect(announcement).toBeInTheDocument();
  });

  it("has focusable elements", () => {
    renderCartContent();

    const title = screen.getByRole("heading", { name: "Votre panier" });
    const quantityInput = screen.getByRole("spinbutton", { name: /quantité/i });
    const removeButton = screen.getByRole("button", { name: /supprimer/i });
    const checkoutButton = screen.getByRole("button", { name: /finaliser/i });

    expect(title).toHaveAttribute("tabindex", "-1");
    expect(quantityInput).not.toHaveAttribute("tabindex", "-1");
    expect(removeButton).not.toHaveAttribute("tabindex", "-1");
    expect(checkoutButton).not.toHaveAttribute("tabindex", "-1");
  });

  it("has proper button labels and descriptions", () => {
    renderCartContent();

    const removeButton = screen.getByRole("button", {
      name: /supprimer.*château margaux/i,
    });
    const checkoutButton = screen.getByRole("button", {
      name: /finaliser.*commande/i,
    });
    const continueButton = screen.getByRole("link", {
      name: /continuer.*achats/i,
    });

    expect(removeButton).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Supprimer"),
    );
    expect(checkoutButton).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Finaliser"),
    );
    expect(continueButton).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Continuer"),
    );
  });

  it("has proper form controls with labels", () => {
    renderCartContent();

    const quantityInput = screen.getByRole("spinbutton", { name: /quantité/i });
    expect(quantityInput).toHaveAttribute("aria-label", "Quantité");
    expect(quantityInput).toHaveAttribute("min", "1");
    expect(quantityInput).toHaveAttribute("max", expect.any(String));
  });

  it("has proper loading states", () => {
    renderCartContent({ actionLoading: true });

    const quantityInput = screen.getByRole("spinbutton", { name: /quantité/i });
    const removeButton = screen.getByRole("button", { name: /supprimer/i });

    expect(quantityInput).toBeDisabled();
    expect(removeButton).toBeDisabled();
  });

  it("has proper error handling accessibility", () => {
    const errorCart = cartDetailedFactory({
      overrideCartLines: [{ availableForSale: false }],
    });
    renderCartContent({ cart: errorCart });

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Rupture de stock");
  });

  it("has proper navigation structure", () => {
    renderCartContent();

    const mainHeading = screen.getByRole("heading", {
      level: 1,
      name: "Votre panier",
    });
    const itemHeading = screen.getByRole("heading", {
      level: 2,
      name: "Château Margaux 2018",
    });

    expect(mainHeading).toBeInTheDocument();
    expect(itemHeading).toBeInTheDocument();
  });

  it("has proper group semantics", () => {
    renderCartContent();

    const quantityGroup = screen.getByRole("group", {
      name: /sélecteur de quantité/i,
    });
    const actionsGroup = screen.getByRole("group", {
      name: /actions du panier/i,
    });

    expect(quantityGroup).toBeInTheDocument();
    expect(actionsGroup).toBeInTheDocument();
  });
});
