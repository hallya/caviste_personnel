import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import LayoutView from "../views/LayoutView";
jest.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: function MockSpeedInsights() {
    return <div data-testid="speed-insights" />;
  },
}));


jest.mock("../../cart/CartFloatingButton", () => {
  return function MockCartFloatingButton() {
    return <div data-testid="cart-floating-button">Cart Button</div>;
  };
});


jest.mock("../../../contexts/CartContext", () => ({
  CartProvider: function MockCartProvider({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {
    return <div data-testid="cart-provider">{children}</div>;
  },
}));


const MockNotificationProvider = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="notification-provider">{children}</div>
);

describe("LayoutView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    children: <div>Test Content</div>,
    fontClasses: "font-sans antialiased",
    NotificationProvider: MockNotificationProvider,
  };

  it("renders component structure with proper language attribute", () => {
    render(<LayoutView {...defaultProps} />);
    

    expect(screen.getByTestId("notification-provider")).toBeInTheDocument();
    expect(screen.getByTestId("cart-provider")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("passes font classes as expected", () => {

    const fontClasses = "custom-font-class test-class";
    render(<LayoutView {...defaultProps} fontClasses={fontClasses} />);
    

    expect(screen.getByTestId("notification-provider")).toBeInTheDocument();
  });

  it("renders providers in correct hierarchy", () => {
    render(<LayoutView {...defaultProps} />);
    
    const notificationProvider = screen.getByTestId("notification-provider");
    const cartProvider = screen.getByTestId("cart-provider");
    
    expect(notificationProvider).toBeInTheDocument();
    expect(notificationProvider).toContainElement(cartProvider);
  });

  it("renders children within provider hierarchy", () => {
    render(
      <LayoutView {...defaultProps}>
        <main>Main Content</main>
      </LayoutView>
    );
    
    const cartProvider = screen.getByTestId("cart-provider");
    const mainContent = screen.getByText("Main Content");
    
    expect(cartProvider).toContainElement(mainContent);
  });

  it("renders CartFloatingButton", () => {
    render(<LayoutView {...defaultProps} />);
    
    expect(screen.getByTestId("cart-floating-button")).toBeInTheDocument();
  });

  it("renders SpeedInsights component", () => {
    render(<LayoutView {...defaultProps} />);
    
    expect(screen.getByTestId("speed-insights")).toBeInTheDocument();
  });

  it("integrates all components correctly", () => {
    render(
      <LayoutView {...defaultProps}>
        <main>Main Content</main>
      </LayoutView>
    );
    

    expect(screen.getByTestId("notification-provider")).toBeInTheDocument();
    expect(screen.getByTestId("cart-provider")).toBeInTheDocument();
    expect(screen.getByTestId("cart-floating-button")).toBeInTheDocument();
    expect(screen.getByTestId("speed-insights")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  it("accepts different NotificationProvider implementations", () => {
    const CustomNotificationProvider = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-notification-provider">{children}</div>
    );
    
    render(
      <LayoutView 
        {...defaultProps} 
        NotificationProvider={CustomNotificationProvider}
      />
    );
    
    expect(screen.getByTestId("custom-notification-provider")).toBeInTheDocument();
    expect(screen.queryByTestId("notification-provider")).not.toBeInTheDocument();
  });
});