import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RouteRegistry, useRouteRegistry } from "../RouteRegistry";
import type { RouteConfig } from "../../shell/types";

const mockRouteConfig: RouteConfig = {
  path: "/test",
  module: "test-module",
  component: jest.fn(() => Promise.resolve(() => <div>Test Component</div>)),
  preload: jest.fn(() => Promise.resolve()),
  ssr: true,
};

function TestComponent() {
  const { registerRoute, preloadRoute, getRouteConfig, preloadOnHover } =
    useRouteRegistry();

  const handleRegister = () => {
    registerRoute(mockRouteConfig);
  };

  const handlePreload = async () => {
    await preloadRoute("/test");
  };

  const handleHoverPreload = () => {
    preloadOnHover("/test");
  };

  const routeConfig = getRouteConfig("/test");

  return (
    <div>
      <button onClick={handleRegister}>Register Route</button>
      <button onClick={handlePreload}>Preload Route</button>
      <button onClick={handleHoverPreload}>Hover Preload</button>
      <div data-testid="route-exists">
        {routeConfig ? "exists" : "not found"}
      </div>
    </div>
  );
}

describe("RouteRegistry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders children correctly", () => {
    render(
      <RouteRegistry>
        <div data-testid="child">Test Child</div>
      </RouteRegistry>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("provides context to children", () => {
    render(
      <RouteRegistry>
        <TestComponent />
      </RouteRegistry>
    );

    expect(
      screen.getByRole("button", { name: "Register Route" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Preload Route" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("route-exists")).toHaveTextContent("not found");
  });

  it("registers routes correctly", async () => {
    render(
      <RouteRegistry>
        <TestComponent />
      </RouteRegistry>
    );

    const registerButton = screen.getByRole("button", {
      name: "Register Route",
    });

    await act(async () => {
      registerButton.click();
    });

    expect(screen.getByTestId("route-exists")).toHaveTextContent("exists");
  });

  it("preloads routes correctly", async () => {
    render(
      <RouteRegistry>
        <TestComponent />
      </RouteRegistry>
    );

    const registerButton = screen.getByRole("button", {
      name: "Register Route",
    });
    const preloadButton = screen.getByRole("button", { name: "Preload Route" });

    await act(async () => {
      registerButton.click();
    });

    await act(async () => {
      preloadButton.click();
    });

    expect(mockRouteConfig.preload).toHaveBeenCalled();
    expect(mockRouteConfig.component).toHaveBeenCalled();
  });

  it("handles hover preload with delay", async () => {
    render(
      <RouteRegistry>
        <TestComponent />
      </RouteRegistry>
    );

    const registerButton = screen.getByRole("button", {
      name: "Register Route",
    });
    const hoverButton = screen.getByRole("button", { name: "Hover Preload" });

    await act(async () => {
      registerButton.click();
    });

    await act(async () => {
      hoverButton.click();
    });

    expect(mockRouteConfig.preload).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    expect(mockRouteConfig.preload).toHaveBeenCalled();
  });

  it("handles non-existent routes gracefully", async () => {
    render(
      <RouteRegistry>
        <TestComponent />
      </RouteRegistry>
    );

    const preloadButton = screen.getByRole("button", { name: "Preload Route" });

    await act(async () => {
      preloadButton.click();
    });

    expect(mockRouteConfig.preload).not.toHaveBeenCalled();
  });

  it("throws error when useRouteRegistry is used outside provider", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    function OutsideComponent() {
      useRouteRegistry();
      return <div>Outside</div>;
    }

    expect(() => render(<OutsideComponent />)).toThrow(
      "useRouteRegistry must be used within RouteRegistry"
    );

    consoleSpy.mockRestore();
  });
});
