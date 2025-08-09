import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import IntroText from "../IntroText";
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

beforeAll(() => {
  global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
    mockIntersectionObserver.mockImplementation(callback);
    return {
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: jest.fn(),
    };
  });
});

describe("IntroText", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders content correctly", () => {
    render(<IntroText />);
    
    expect(screen.getByText("Un vin, un visage. Une bouteille, une histoire.")).toBeInTheDocument();
    expect(screen.getByText(/Chez Edouard, chaque vin est choisi avec soin/)).toBeInTheDocument();
    expect(screen.getByText(/Des cuvées confidentielles, issues de petites parcelles/)).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    render(<IntroText />);
    
    const section = screen.getByRole("region", { name: "Notre philosophie" });
    const heading = screen.getByRole("heading", { level: 2 });
    
    expect(section).toBeInTheDocument();
    expect(heading).toHaveTextContent("Notre philosophie");
    expect(heading).toHaveClass("sr-only");
  });

  it("has correct ARIA attributes", () => {
    render(<IntroText />);
    
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute("aria-labelledby", "intro-heading");
  });

  it("starts with invisible state", () => {
    render(<IntroText />);
    
    const section = screen.getByRole("region");
    expect(section).toHaveClass("opacity-0", "translate-y-5");
  });

  it("sets up IntersectionObserver when supported", () => {
    render(<IntroText />);
    
    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.15 }
    );
    expect(mockObserve).toHaveBeenCalled();
  });

  it("becomes visible when intersecting", async () => {
    render(<IntroText />);
    
  
    act(() => {
      mockIntersectionObserver([{ isIntersecting: true }]);
    });
    
    await waitFor(() => {
      const section = screen.getByRole("region");
      expect(section).toHaveClass("opacity-100", "translate-y-0");
    });
  });

  it("disconnects observer when intersecting", async () => {
    render(<IntroText />);
    
    act(() => {
      mockIntersectionObserver([{ isIntersecting: true }]);
    });
    
    await waitFor(() => {
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  it("handles multiple entries and stops at first intersecting", async () => {
    render(<IntroText />);
    
    act(() => {
      mockIntersectionObserver([
        { isIntersecting: false },
        { isIntersecting: true },
        { isIntersecting: false },
      ]);
    });
    
    await waitFor(() => {
      const section = screen.getByRole("region");
      expect(section).toHaveClass("opacity-100", "translate-y-0");
    });
  });

  it("has correct responsive styling classes", () => {
    render(<IntroText />);
    
    const section = screen.getByRole("region");
    expect(section).toHaveClass(
      "mx-auto",
      "max-w-prose",
      "font-prata",
      "text-neutral-700",
      "text-lg",
      "leading-relaxed",
      "px-2",
      "transition-all",
      "duration-700"
    );
  });
});