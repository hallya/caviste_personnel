import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AppShell, useAppShell } from "../AppShell";
import type { FeatureModule, ModuleConfig } from "../types";

const mockFeatureModule: FeatureModule = {
  initialize: jest.fn(),
  getPublicAPI: jest.fn(() => ({ testMethod: () => "test" })),
  destroy: jest.fn(),
};

const mockModuleConfig: ModuleConfig = {
  name: "test-module",
  routes: ["/test"],
  publicAPI: { testMethod: () => "test" },
};

function TestComponent() {
  const { registerModule, getModuleAPI, isModuleLoaded } = useAppShell();

  const handleRegister = () => {
    registerModule("test-module", mockFeatureModule, mockModuleConfig);
  };

  const moduleLoaded = isModuleLoaded("test-module");
  const moduleAPI = getModuleAPI("test-module");

  return (
    <div>
      <button onClick={handleRegister}>Register Module</button>
      <div data-testid="module-loaded">{moduleLoaded.toString()}</div>
      <div data-testid="module-api">
        {moduleAPI ? "API Available" : "No API"}
      </div>
    </div>
  );
}

describe("AppShell", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <AppShell>
        <div data-testid="child">Test Child</div>
      </AppShell>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("provides context to children", () => {
    render(
      <AppShell>
        <TestComponent />
      </AppShell>,
    );

    expect(
      screen.getByRole("button", { name: "Register Module" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("module-loaded")).toHaveTextContent("false");
    expect(screen.getByTestId("module-api")).toHaveTextContent("No API");
  });

  it("registers modules correctly", async () => {
    render(
      <AppShell>
        <TestComponent />
      </AppShell>,
    );

    const registerButton = screen.getByRole("button", {
      name: "Register Module",
    });

    await act(async () => {
      registerButton.click();
    });

    expect(screen.getByTestId("module-loaded")).toHaveTextContent("true");
    expect(screen.getByTestId("module-api")).toHaveTextContent("API Available");
  });

  it("returns null for non-existent modules", () => {
    function NonExistentModuleTest() {
      const { getModule, getModuleAPI, isModuleLoaded } = useAppShell();

      return (
        <div>
          <div data-testid="non-existent-loaded">
            {isModuleLoaded("non-existent").toString()}
          </div>
          <div data-testid="non-existent-api">
            {getModuleAPI("non-existent") ? "Found" : "Not Found"}
          </div>
          <div data-testid="non-existent-module">
            {getModule("non-existent") ? "Found" : "Not Found"}
          </div>
        </div>
      );
    }

    render(
      <AppShell>
        <NonExistentModuleTest />
      </AppShell>,
    );

    expect(screen.getByTestId("non-existent-loaded")).toHaveTextContent(
      "false",
    );
    expect(screen.getByTestId("non-existent-api")).toHaveTextContent(
      "Not Found",
    );
    expect(screen.getByTestId("non-existent-module")).toHaveTextContent(
      "Not Found",
    );
  });

  it("throws error when useAppShell is used outside provider", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    function OutsideComponent() {
      useAppShell();
      return <div>Outside</div>;
    }

    expect(() => render(<OutsideComponent />)).toThrow(
      "useAppShell must be used within AppShell",
    );

    consoleSpy.mockRestore();
  });
});
