import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { AppShell } from "../shell/AppShell";
import { RouteRegistry } from "../routing/RouteRegistry";
import { useModules } from "../hooks/useModules";
import { useSafeAppShell } from "../hooks/useSafeAppShell";

const mockAddToCart = jest.fn();
const mockShowNotification = jest.fn();

const MockCartModule = ({ children }: { children: React.ReactNode }) => {
  const appShell = useSafeAppShell();

  React.useEffect(() => {
    const featureModule = {
      initialize: jest.fn(),
      getPublicAPI: () => ({
        addToCart: mockAddToCart,
        removeItem: jest.fn(),
        getItems: () => [],
        getTotalPrice: () => 0,
      }),
      destroy: jest.fn(),
    };

    const moduleConfig = {
      name: "cart",
      routes: [],
      publicAPI: featureModule.getPublicAPI(),
    };

    appShell.registerModule("cart", featureModule, moduleConfig);

    return () => {
      featureModule.destroy();
    };
  }, []);

  return <>{children}</>;
};

const MockNotificationModule = ({ children }: { children: React.ReactNode }) => {
  const appShell = useSafeAppShell();

  React.useEffect(() => {
    const featureModule = {
      initialize: jest.fn(),
      getPublicAPI: () => ({
        showNotification: mockShowNotification,
        hideNotification: jest.fn(),
        hideNotificationGroup: jest.fn(),
      }),
      destroy: jest.fn(),
    };

    const moduleConfig = {
      name: "notifications",
      routes: [],
      publicAPI: featureModule.getPublicAPI(),
    };

    appShell.registerModule("notifications", featureModule, moduleConfig);

    return () => {
      featureModule.destroy();
    };
  }, []);

  return <>{children}</>;
};

function IntegrationTestComponent() {
  const { cart, notifications } = useModules();

  const handleAddToCartWithNotification = async () => {
    if (cart?.api && notifications?.api) {
      try {
        await cart.api.addToCart("product-1", 1);
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
      <div data-testid="cart-loaded">{cart?.isLoaded?.toString() || "false"}</div>
      <div data-testid="notifications-loaded">
        {notifications?.isLoaded?.toString() || "false"}
      </div>
      <button onClick={handleAddToCartWithNotification}>
        Add to Cart with Notification
      </button>
    </div>
  );
}

describe("Module Integration", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
  });

  it("allows modules to communicate through their public APIs", async () => {
    render(
      <AppShell>
        <RouteRegistry>
          <MockCartModule>
            <MockNotificationModule>
              <IntegrationTestComponent />
            </MockNotificationModule>
          </MockCartModule>
        </RouteRegistry>
      </AppShell>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("cart-loaded")).toHaveTextContent("true");
      expect(screen.getByTestId("notifications-loaded")).toHaveTextContent(
        "true",
      );
    });

    const button = screen.getByRole("button", {
      name: "Add to Cart with Notification",
    });

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
          <div data-testid="cart-api-available">{cart?.api ? "yes" : "no"}</div>
          <div data-testid="notifications-api-available">
            {notifications?.api ? "yes" : "no"}
          </div>
        </div>
      );
    }

    render(
      <AppShell>
        <MockCartModule>
          <MockNotificationModule>
            <APIAccessTest />
          </MockNotificationModule>
        </MockCartModule>
      </AppShell>,
    );

    expect(screen.getByTestId("cart-api-available")).toHaveTextContent("yes");
    expect(screen.getByTestId("notifications-api-available")).toHaveTextContent(
      "yes",
    );
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
      </AppShell>,
    );

    expect(screen.getByTestId("cart-loading-state")).toHaveTextContent(
      "not-loaded",
    );
    expect(screen.getByTestId("notifications-loading-state")).toHaveTextContent(
      "not-loaded",
    );
  });
});
