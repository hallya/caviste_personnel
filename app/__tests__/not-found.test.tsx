import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import NotFound from "../not-found";
jest.mock("next/link", () => {
  return function MockLink({ 
    href, 
    children, 
    className 
  }: { 
    href: string; 
    children: React.ReactNode; 
    className?: string; 
  }) {
    return (
      <a href={href} className={className} data-testid="link-home">
        {children}
      </a>
    );
  };
});

describe("NotFound", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 404 error page", () => {
    render(<NotFound />);
    
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page non trouvée")).toBeInTheDocument();
  });

  it("has navigation link to home", () => {
    render(<NotFound />);
    
    const homeLink = screen.getByTestId("link-home");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink).toHaveTextContent("Retour à l'accueil");
  });

  it("has correct container styling", () => {
    const { container } = render(<NotFound />);
    
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("container", "mx-auto", "px-4", "py-8");
  });

  it("has proper accessibility structure", () => {
    render(<NotFound />);
    
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("404");
  });

  it("has responsive design classes", () => {
    render(<NotFound />);
    
    const contentContainer = screen.getByText("404").closest(".text-center");
    expect(contentContainer).toHaveClass("text-center");
  });

  it("has interactive button styling", () => {
    render(<NotFound />);
    
    const homeLink = screen.getByTestId("link-home");
    expect(homeLink).toHaveClass(
      "px-6",
      "py-3",
      "bg-primary-600",
      "text-white",
      "rounded-lg",
      "hover:bg-primary-700",
      "transition-colors"
    );
  });
});