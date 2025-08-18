import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useModules } from "../useModules";
import { AppShell } from "../../shell/AppShell";
import { CartModule } from "../../../modules/cart/CartModule";
import { NotificationModule } from "../../../modules/notifications/NotificationModule";


jest.mock("../../../components/cart/hooks/useCart", () => ({
  useCart: () => ({
    cart: { lines: [], totalAmount: "0", totalQuantity: 0 },
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
    addToCart: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    refetch: jest.fn(),
  }),
}));


jest.mock("../../hooks/useSafeNotification", () => ({
  useSafeNotification: () => ({
    showNotification: jest.fn(),
    hideNotification: jest.fn(),
    hideNotificationGroup: jest.fn(),
  }),
}));

function TestComponent() {
  const { cart, notifications } = useModules();
  
  return (
    <div>
      <div data-testid="cart-api">{cart.api ? "available" : "not-available"}</div>
      <div data-testid="cart-loaded">{cart.isLoaded.toString()}</div>
      <div data-testid="notifications-api">{notifications.api ? "available" : "not-available"}</div>
      <div data-testid="notifications-loaded">{notifications.isLoaded.toString()}</div>
    </div>
  );
}

describe("useModules", () => {
  it("returns module APIs when modules are loaded", () => {
    render(
      <AppShell>
        <CartModule>
          <NotificationModule>
            <TestComponent />
          </NotificationModule>
        </CartModule>
      </AppShell>
    );

    expect(screen.getByTestId("cart-api")).toHaveTextContent("available");
    expect(screen.getByTestId("cart-loaded")).toHaveTextContent("true");
    expect(screen.getByTestId("notifications-api")).toHaveTextContent("available");
    expect(screen.getByTestId("notifications-loaded")).toHaveTextContent("true");
  });

  it("returns null APIs when modules are not loaded", () => {
    render(
      <AppShell>
        <TestComponent />
      </AppShell>
    );

    expect(screen.getByTestId("cart-api")).toHaveTextContent("not-available");
    expect(screen.getByTestId("cart-loaded")).toHaveTextContent("false");
    expect(screen.getByTestId("notifications-api")).toHaveTextContent("not-available");
    expect(screen.getByTestId("notifications-loaded")).toHaveTextContent("false");
  });

  it("returns safe fallback when used outside AppShell", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("cart-api")).toHaveTextContent("not-available");
    expect(screen.getByTestId("cart-loaded")).toHaveTextContent("false");
    expect(screen.getByTestId("notifications-api")).toHaveTextContent("not-available");
    expect(screen.getByTestId("notifications-loaded")).toHaveTextContent("false");
  });

  it("handles partial module loading", () => {
    render(
      <AppShell>
        <CartModule>
          <TestComponent />
        </CartModule>
      </AppShell>
    );

    expect(screen.getByTestId("cart-api")).toHaveTextContent("available");
    expect(screen.getByTestId("cart-loaded")).toHaveTextContent("true");
    expect(screen.getByTestId("notifications-api")).toHaveTextContent("not-available");
    expect(screen.getByTestId("notifications-loaded")).toHaveTextContent("false");
  });
});
