import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PageHeader } from "../";

describe("PageHeader", () => {
  it("renders as h1 for homepage", () => {
    render(<PageHeader isHomePage={true} />);

    const header = screen.getByRole("heading", { level: 1 });
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Edouard, Caviste personnel");
  });

  it("renders as div for other pages", () => {
    render(<PageHeader isHomePage={false} />);

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();

    const header = screen.getByText("Edouard, Caviste personnel");
    expect(header.tagName).toBe("DIV");
  });

  it("defaults to div when isHomePage is not provided", () => {
    render(<PageHeader />);

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();

    const header = screen.getByText("Edouard, Caviste personnel");
    expect(header.tagName).toBe("DIV");
  });

  it("applies correct CSS classes", () => {
    render(<PageHeader isHomePage={true} />);

    const container = screen.getByText(
      "Edouard, Caviste personnel",
    ).parentElement;
    expect(container).toHaveClass("bg-primary-50", "pt-8", "pb-4");

    const header = screen.getByRole("heading", { level: 1 });
    expect(header).toHaveClass("text-center", "text-title", "text-primary-600");
  });

  it("maintains accessibility structure", () => {
    render(<PageHeader isHomePage={true} />);

    const header = screen.getByRole("heading", { level: 1 });
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Edouard, Caviste personnel");
  });
});
