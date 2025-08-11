import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CartItem from "../CartItem";
import { CartTestFactories } from "../../../__tests__/factories";

describe("CartItem", () => {
  const mockOnQuantityChange = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderCartItem = (overrides = {}) => {
    const defaultProps = {
      item: CartTestFactories.createCartLine(),
      onQuantityChange: mockOnQuantityChange,
      onRemove: mockOnRemove,
      loading: false,
      ...overrides,
    };

    return render(<CartItem {...defaultProps} />);
  };

  describe("Rendering", () => {
    it("displays item information correctly", () => {
      const item = CartTestFactories.createCartLine();
      renderCartItem({ item });

      expect(
        screen.getByRole("heading", { name: item.title })
      ).toBeInTheDocument();
      expect(screen.getByText(item.lineTotal)).toBeInTheDocument();
      expect(screen.getByText(`${item.price} l'unité`)).toBeInTheDocument();
      expect(screen.getByRole("spinbutton", { name: /quantité/i })).toHaveValue(
        item.quantity
      );
    });

    it("displays product image when available", () => {
      const item = CartTestFactories.createCartLine();
      renderCartItem({ item });

      const image = screen.getByAltText(`Image de ${item.title}`);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        "src",
        expect.stringContaining("example.com")
      );
    });

    it("renders as semantic article element", () => {
      renderCartItem();

      expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("has proper header structure", () => {
      renderCartItem();

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("calls onQuantityChange when quantity is increased", async () => {
      const user = userEvent.setup();
      const item = CartTestFactories.createCartLine();
      renderCartItem({ item });

      const increaseButton = screen.getByRole("button", { name: /augmenter/i });
      await user.click(increaseButton);

      expect(mockOnQuantityChange).toHaveBeenCalledWith(
        item.id,
        item.quantity + 1
      );
    });

    it("calls onQuantityChange when quantity is decreased", async () => {
      const user = userEvent.setup();
      const item = CartTestFactories.createCartLine({ quantity: 3 });
      renderCartItem({ item });

      const decreaseButton = screen.getByRole("button", { name: /diminuer/i });
      await user.click(decreaseButton);

      expect(mockOnQuantityChange).toHaveBeenCalledWith(item.id, 2);
    });

    it("calls onRemove when remove button is clicked", async () => {
      const user = userEvent.setup();
      const item = CartTestFactories.createCartLine();
      renderCartItem({ item });

      const removeButton = screen.getByRole("button", { name: /supprimer/i });
      await user.click(removeButton);

      expect(mockOnRemove).toHaveBeenCalledWith(item.id);
    });
  });

  describe("Loading State", () => {
    it("disables all controls when loading", () => {
      renderCartItem({ loading: true });

      const increaseButton = screen.getByRole("button", { name: /augmenter/i });
      const decreaseButton = screen.getByRole("button", { name: /diminuer/i });
      const removeButton = screen.getByRole("button", { name: /supprimer/i });
      const quantityInput = screen.getByRole("spinbutton");

      expect(increaseButton).toBeDisabled();
      expect(decreaseButton).toBeDisabled();
      expect(removeButton).toBeDisabled();
      expect(quantityInput).toBeDisabled();
    });
  });

  describe("Stock Management", () => {
    it("shows stock warning when quantity available is low", () => {
      const item = CartTestFactories.createCartLine({ quantityAvailable: 5 });
      renderCartItem({ item });

      expect(screen.getByText("Plus que 5 en stock")).toBeInTheDocument();
    });

    it("shows out of stock message when not available for sale", () => {
      const item = CartTestFactories.createCartLine({
        availableForSale: false,
      });
      renderCartItem({ item });

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Rupture de stock");
    });

    it("disables quantity controls when out of stock", () => {
      const item = CartTestFactories.createCartLine({
        availableForSale: false,
      });
      renderCartItem({ item });

      const increaseButton = screen.getByRole("button", { name: /augmenter/i });
      const quantityInput = screen.getByRole("spinbutton");

      expect(increaseButton).toBeDisabled();
      expect(quantityInput).toBeDisabled();
    });

    it("prevents increasing quantity beyond available stock", async () => {
      const user = userEvent.setup();
      const item = CartTestFactories.createCartLine({
        quantity: 3,
        quantityAvailable: 3,
      });
      renderCartItem({ item });

      const increaseButton = screen.getByRole("button", { name: /augmenter/i });
      await user.click(increaseButton);

      expect(mockOnQuantityChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels for interactive elements", () => {
      const item = CartTestFactories.createCartLine();
      renderCartItem({ item });

      const removeButton = screen.getByRole("button", { name: /supprimer/i });
      const quantityInput = screen.getByRole("spinbutton", {
        name: /quantité/i,
      });

      expect(removeButton).toHaveAttribute(
        "aria-label",
        expect.stringContaining(item.title)
      );
      expect(quantityInput).toHaveAttribute("aria-label", "Quantité");
    });

    it("has proper ARIA label for total price", () => {
      const item = CartTestFactories.createCartLine();
      renderCartItem({ item });

      const total = screen.getByText(item.lineTotal);
      expect(total).toHaveAttribute(
        "aria-label",
        expect.stringContaining("Prix total")
      );
    });

    it("has semantic structure with proper roles", () => {
      renderCartItem();

      expect(screen.getByRole("article")).toBeInTheDocument();
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(
        screen.getByRole("group", { name: /sélecteur de quantité/i })
      ).toBeInTheDocument();
    });

    it("has focusable elements with proper tab order", () => {
      renderCartItem();

      const quantityInput = screen.getByRole("spinbutton", {
        name: /quantité/i,
      });
      const removeButton = screen.getByRole("button", { name: /supprimer/i });

      expect(quantityInput).not.toHaveAttribute("tabindex", "-1");
      expect(removeButton).not.toHaveAttribute("tabindex", "-1");
    });

    it("has proper image accessibility", () => {
      const item = CartTestFactories.createCartLine();
      renderCartItem({ item });

      const image = screen.getByRole("img", { name: `Image de ${item.title}` });
      expect(image).toBeInTheDocument();
    });

    it("has proper form controls with constraints", () => {
      const item = CartTestFactories.createCartLine();
      renderCartItem({ item });

      const quantityInput = screen.getByRole("spinbutton", {
        name: /quantité/i,
      });
      expect(quantityInput).toHaveAttribute("min", "1");
      expect(quantityInput).toHaveAttribute("max", expect.any(String));
    });

    it("has proper error state accessibility", () => {
      const item = CartTestFactories.createCartLine({
        availableForSale: false,
      });
      renderCartItem({ item });

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Rupture de stock");
    });

    it("has proper loading state accessibility", () => {
      renderCartItem({ loading: true });

      const increaseButton = screen.getByRole("button", { name: /augmenter/i });
      const decreaseButton = screen.getByRole("button", { name: /diminuer/i });
      const removeButton = screen.getByRole("button", { name: /supprimer/i });
      const quantityInput = screen.getByRole("spinbutton", {
        name: /quantité/i,
      });

      expect(increaseButton).toBeDisabled();
      expect(decreaseButton).toBeDisabled();
      expect(removeButton).toBeDisabled();
      expect(quantityInput).toBeDisabled();
    });

    it("has proper navigation structure", () => {
      const item = CartTestFactories.createCartLine();
      renderCartItem({ item });

      const itemHeading = screen.getByRole("heading", {
        level: 2,
        name: item.title,
      });
      expect(itemHeading).toBeInTheDocument();
    });

    it("has proper group semantics for quantity controls", () => {
      renderCartItem();

      const quantityGroup = screen.getByRole("group", {
        name: /sélecteur de quantité/i,
      });
      expect(quantityGroup).toBeInTheDocument();
    });
  });
});
