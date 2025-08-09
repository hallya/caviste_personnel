import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import LayoutContainer from "../containers/LayoutContainer";
jest.mock("next/font/google", () => ({
  Geist: jest.fn(() => ({
    variable: "--font-geist-sans",
  })),
  Geist_Mono: jest.fn(() => ({
    variable: "--font-geist-mono",
  })),
  Prata: jest.fn(() => ({
    variable: "--font-prata",
  })),
}));


jest.mock("../../../contexts/NotificationContext", () => ({
  NotificationProvider: function MockNotificationProvider({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {
    return <div data-testid="notification-provider">{children}</div>;
  },
}));


jest.mock("../views/LayoutView", () => {
  return function MockLayoutView({ 
    children, 
    fontClasses, 
    NotificationProvider 
  }: { 
    children: React.ReactNode; 
    fontClasses: string; 
    NotificationProvider: React.ComponentType<{ children: React.ReactNode }>; 
  }) {
    return (
      <div data-testid="layout-view" data-font-classes={fontClasses}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </div>
    );
  };
});

describe("LayoutContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children within LayoutView", () => {
    render(
      <LayoutContainer>
        <div>Test Content</div>
      </LayoutContainer>
    );

    expect(screen.getByTestId("layout-view")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("passes correct font classes to LayoutView", () => {
    render(
      <LayoutContainer>
        <div>Content</div>
      </LayoutContainer>
    );

    const layoutView = screen.getByTestId("layout-view");
    const fontClasses = layoutView.getAttribute("data-font-classes");
    
    expect(fontClasses).toContain("--font-geist-sans");
    expect(fontClasses).toContain("--font-geist-mono");
    expect(fontClasses).toContain("--font-prata");
    expect(fontClasses).toContain("antialiased");
  });

  it("passes NotificationProvider to LayoutView", () => {
    render(
      <LayoutContainer>
        <div>Content</div>
      </LayoutContainer>
    );

    expect(screen.getByTestId("notification-provider")).toBeInTheDocument();
  });

  it("maintains proper component hierarchy", () => {
    render(
      <LayoutContainer>
        <main>Main Content</main>
      </LayoutContainer>
    );

    const layoutView = screen.getByTestId("layout-view");
    const notificationProvider = screen.getByTestId("notification-provider");
    const mainContent = screen.getByText("Main Content");

    expect(layoutView).toContainElement(notificationProvider);
    expect(notificationProvider).toContainElement(mainContent);
  });

  it("handles multiple children correctly", () => {
    render(
      <LayoutContainer>
        <header>Header</header>
        <main>Main</main>
        <footer>Footer</footer>
      </LayoutContainer>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});