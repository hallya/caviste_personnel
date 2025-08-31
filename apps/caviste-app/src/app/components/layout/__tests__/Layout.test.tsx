import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Layout from "../Layout";

jest.mock("@pkg/notifications", () => ({
  NotificationProvider: function MockNotificationProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="notification-provider">{children}</div>;
  },
}));

jest.mock("@pkg/cart", () => ({
  CartProvider: function MockCartProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="cart-provider">{children}</div>;
  },
  useCart: () => ({
    items: [],
    isLoading: false,
  }),
  CartFloatingButton: function MockCartFloatingButton() {
    return <div data-testid="cart-floating-button">Cart Button</div>;
  },
  createCartModule: () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@pkg/core", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div data-testid="app-shell">{children}</div>,
  RouteRegistry: ({ children }: { children: React.ReactNode }) => <div data-testid="route-registry">{children}</div>,
}));

jest.mock("@pkg/analytics", () => ({
  AnalyticsProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="analytics-provider">{children}</div>,
}));

describe("Layout", () => {
  it("renders children within providers", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    expect(screen.getByTestId("notification-provider")).toBeInTheDocument();
    expect(screen.getByTestId("cart-provider")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("includes cart floating button", () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

    expect(screen.getByTestId("cart-floating-button")).toBeInTheDocument();
  });

  it("maintains proper component hierarchy", () => {
    render(
      <Layout>
        <main>Main Content</main>
      </Layout>,
    );

    const cartProvider = screen.getByTestId("cart-provider");
    const notificationProvider = screen.getByTestId("notification-provider");
    const mainContent = screen.getByText("Main Content");

    expect(cartProvider).toContainElement(notificationProvider);
    expect(notificationProvider).toContainElement(mainContent);
  });

  it("handles multiple children correctly", () => {
    render(
      <Layout>
        <header>Header</header>
        <main>Main</main>
        <footer>Footer</footer>
      </Layout>,
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
