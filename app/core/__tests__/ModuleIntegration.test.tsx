import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AppShell } from "../shell/AppShell";
import { RouteRegistry } from "../routing/RouteRegistry";
import { CartModule } from "../../modules/cart/CartModule";
import { NotificationModule } from "../../modules/notifications/NotificationModule";
import { useModules } from "../hooks/useModules";


jest.mock("../../components/cart/hooks/useCart", () => ({
  useCart: () => ({
    cart: { lines: [], totalAmount: "0", totalQuantity: 0 },
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
    addToCart: jest.fn(() => Promise.resolve({ cart: {} })),
    removeItem: jest.fn(() => Promise.resolve({})),
    updateQuantity: jest.fn(() => Promise.resolve({})),
    refetch: jest.fn(() => Promise.resolve()),
  }),
}));


const mockShowNotification = jest.fn();

jest.mock("../hooks/useSafeNotification", () => ({
  useSafeNotification: () => ({
    showNotification: mockShowNotification,
    hideNotification: jest.fn(),
    hideNotificationGroup: jest.fn(),
  }),
}));

function IntegrationTestComponent() {
  const { cart, notifications } = useModules();
  
  const handleAddToCartWithNotification = async () => {
    if (cart.api && notifications.api) {
      try {
        await cart.api.addToCart("product-1", "variant-1", 1);
        notifications.api.showNotification({
          type: "success",
          title: "Success",
          message: "Item added to cart",
        });
      } catch {
        notifications.api.showNotification({
          type: "error",
          title: "Error",
          message: "Failed to add item",
        });
      }
    }
  };

  return (
    <div>
      <div data-testid="cart-loaded">{cart.isLoaded.toString()}</div>
      <div data-testid="notifications-loaded">{notifications.isLoaded.toString()}</div>
      <button onClick={handleAddToCartWithNotification}>
        Add to Cart with Notification
      </button>
    </div>
  );
}

describe("Module Integration", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allows modules to communicate through their public APIs", async () => {
    render(
      <AppShell>
        <RouteRegistry>
          <CartModule>
            <NotificationModule>
              <IntegrationTestComponent />
            </NotificationModule>
          </CartModule>
        </RouteRegistry>
      </AppShell>
    );


    await waitFor(() => {
      expect(screen.getByTestId("cart-loaded")).toHaveTextContent("true");
      expect(screen.getByTestId("notifications-loaded")).toHaveTextContent("true");
    });

    const button = screen.getByRole("button", { name: "Add to Cart with Notification" });
    
    await user.click(button);

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: "success",
        title: "Success",
        message: "Item added to cart",
      });
    });
  });

  it("provides access to module APIs through useModules", () => {
    function APIAccessTest() {
      const { cart, notifications } = useModules();
      
      return (
        <div>
          <div data-testid="cart-api-available">{cart.api ? "yes" : "no"}</div>
          <div data-testid="notifications-api-available">{notifications.api ? "yes" : "no"}</div>
        </div>
      );
    }

    render(
      <AppShell>
        <CartModule>
          <NotificationModule>
            <APIAccessTest />
          </NotificationModule>
        </CartModule>
      </AppShell>
    );

    expect(screen.getByTestId("cart-api-available")).toHaveTextContent("yes");
    expect(screen.getByTestId("notifications-api-available")).toHaveTextContent("yes");
  });

  it("handles module loading states correctly", () => {
    function LoadingStatesTest() {
      const { cart, notifications } = useModules();
      
      return (
        <div>
          <div data-testid="cart-loading-state">
            {cart.isLoaded ? "loaded" : "not-loaded"}
          </div>
          <div data-testid="notifications-loading-state">
            {notifications.isLoaded ? "loaded" : "not-loaded"}
          </div>
        </div>
      );
    }


    render(
      <AppShell>
        <LoadingStatesTest />
      </AppShell>
    );

    expect(screen.getByTestId("cart-loading-state")).toHaveTextContent("not-loaded");
    expect(screen.getByTestId("notifications-loading-state")).toHaveTextContent("not-loaded");
  });
});
