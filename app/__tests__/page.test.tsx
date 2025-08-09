import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import HomePage from "../page";


jest.mock("../components/home/containers/HomeContainer", () => {
  return function MockHomeContainer() {
    return <div data-testid="home-container">Home Container</div>;
  };
});

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders successfully", () => {
    render(<HomePage />);
    
    expect(screen.getByTestId("home-container")).toBeInTheDocument();
  });

  it("renders HomeContainer component", () => {
    render(<HomePage />);
    
    const homeContainer = screen.getByTestId("home-container");
    expect(homeContainer).toBeInTheDocument();
    expect(homeContainer).toHaveTextContent("Home Container");
  });

  it("maintains correct component structure", () => {
    const { container } = render(<HomePage />);
    

    expect(container.firstChild).toEqual(screen.getByTestId("home-container"));
  });
});