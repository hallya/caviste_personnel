import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Layout from "../Layout";

jest.mock("../../../contexts/NotificationContext", () => ({
  NotificationProvider: function MockNotificationProvider({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {
    return <div data-testid="notification-provider">{children}</div>;
  },
}));

jest.mock("../../../contexts/CartContext", () => ({
  CartProvider: function MockCartProvider({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {
    return <div data-testid="cart-provider">{children}</div>;
  },
}));

jest.mock("../../cart/CartFloatingButton", () => {
  return function MockCartFloatingButton() {
    return <div data-testid="cart-floating-button">Cart Button</div>;
  };
});



describe("Layout", () => {
  it("renders children within providers", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId("notification-provider")).toBeInTheDocument();
    expect(screen.getByTestId("cart-provider")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("includes cart floating button", () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByTestId("cart-floating-button")).toBeInTheDocument();
  });



  it("maintains proper component hierarchy", () => {
    render(
      <Layout>
        <main>Main Content</main>
      </Layout>
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
      </Layout>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
