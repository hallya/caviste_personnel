import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CartNotification from "../CartNotification";

const mockOnClose = jest.fn();

const defaultProps = {
  type: "success" as const,
  title: "Produit ajouté",
  message: "Château Margaux ajouté au panier",
  onClose: mockOnClose,
  autoClose: false,
};

describe("CartNotification", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders notification with correct content", () => {
    render(<CartNotification {...defaultProps} />);

    expect(screen.getByText("Produit ajouté")).toBeInTheDocument();
    expect(
      screen.getByText("Château Margaux ajouté au panier")
    ).toBeInTheDocument();
  });

  it("applies correct styling for success type", () => {
    render(<CartNotification {...defaultProps} />);

    const notification = screen.getByRole("alert");
    expect(notification).toHaveClass("border-primary-600");
  });

  it("applies correct styling for error type", () => {
    render(<CartNotification {...defaultProps} type="error" />);

    const notification = screen.getByRole("alert");
    expect(notification).toHaveClass("border-primary-600");
  });

  it("shows cart button when type is success", () => {
    render(<CartNotification {...defaultProps} />);

    expect(screen.getByText("Voir le panier")).toBeInTheDocument();
    expect(screen.getByText("Continuer mes achats")).toBeInTheDocument();
  });

  it("does not show cart buttons when type is error", () => {
    render(<CartNotification {...defaultProps} type="error" />);

    expect(
      screen.queryByText("Voir le panier")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Continuer mes achats")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    render(<CartNotification {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: /fermer/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onClose when "Continuer mes achats" button is clicked', async () => {
    render(<CartNotification {...defaultProps} />);

    const continueButton = screen.getByText("Continuer mes achats");
    await user.click(continueButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("shows cart button when type is success", () => {
    render(<CartNotification {...defaultProps} />);

    expect(screen.getByText("Voir le panier")).toBeInTheDocument();
  });

  it("auto-closes notification when autoClose is true", async () => {
    jest.useFakeTimers();

    render(
      <CartNotification
        {...defaultProps}
        autoClose={true}
        autoCloseDelay={1000}
      />
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(
      () => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 }
    );

    jest.useRealTimers();
  });

  it("does not auto-close when autoClose is false", async () => {
    jest.useFakeTimers();

    render(
      <CartNotification
        {...defaultProps}
        autoClose={false}
        autoCloseDelay={1000}
      />
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(
      () => {
        expect(mockOnClose).not.toHaveBeenCalled();
      },
      { timeout: 2000 }
    );

    jest.useRealTimers();
  });

  it("has correct accessibility attributes", () => {
    render(<CartNotification {...defaultProps} />);

    const notification = screen.getByRole("alert");
    expect(notification).toBeInTheDocument();
  });

  it("renders with correct positioning classes", () => {
    render(<CartNotification {...defaultProps} />);

    const notification = screen.getByRole("alert");
    expect(notification).toHaveClass("fixed", "top-4", "right-4");
  });

  it("shows success icon for success type", () => {
    render(<CartNotification {...defaultProps} />);

    const successIcon = screen.getByTestId("success-icon");
    expect(successIcon).toBeInTheDocument();
  });

  it("shows error icon for error type", () => {
    render(<CartNotification {...defaultProps} type="error" />);

    const errorIcon = screen.getByTestId("error-icon");
    expect(errorIcon).toBeInTheDocument();
  });

  it("applies correct animation classes", () => {
    render(<CartNotification {...defaultProps} />);

    const notification = screen.getByRole("alert");
    expect(notification).toHaveClass(
      "transform",
      "transition-all",
      "duration-300"
    );
  });

  it("renders title with bold styling", () => {
    render(<CartNotification {...defaultProps} />);

    const title = screen.getByText("Produit ajouté");
    expect(title).toHaveClass("font-bold");
  });
});
