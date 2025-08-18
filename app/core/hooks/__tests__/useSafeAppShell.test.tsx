import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSafeAppShell } from "../useSafeAppShell";
import { AppShell } from "../../shell/AppShell";
import type { FeatureModule, ModuleConfig } from "../../shell/types";

function TestComponent() {
  const appShell = useSafeAppShell();
  
  return (
    <div>
      <div data-testid="register-available">{typeof appShell.registerModule}</div>
      <div data-testid="get-module-available">{typeof appShell.getModule}</div>
      <div data-testid="get-api-available">{typeof appShell.getModuleAPI}</div>
      <div data-testid="is-loaded-available">{typeof appShell.isModuleLoaded}</div>
    </div>
  );
}

describe("useSafeAppShell", () => {
  it("provides safe fallback when used outside AppShell", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("register-available")).toHaveTextContent("function");
    expect(screen.getByTestId("get-module-available")).toHaveTextContent("function");
    expect(screen.getByTestId("get-api-available")).toHaveTextContent("function");
    expect(screen.getByTestId("is-loaded-available")).toHaveTextContent("function");
  });

  it("returns actual context when used within AppShell", () => {
    render(
      <AppShell>
        <TestComponent />
      </AppShell>
    );

    expect(screen.getByTestId("register-available")).toHaveTextContent("function");
    expect(screen.getByTestId("get-module-available")).toHaveTextContent("function");
    expect(screen.getByTestId("get-api-available")).toHaveTextContent("function");
    expect(screen.getByTestId("is-loaded-available")).toHaveTextContent("function");
  });

  it("safe fallback methods do not throw errors", () => {
    function TestSafeFallback() {
      const appShell = useSafeAppShell();
      

      appShell.registerModule("test", {} as FeatureModule, {} as ModuleConfig);
      const testModule = appShell.getModule("test");
      const api = appShell.getModuleAPI("test");
      const isLoaded = appShell.isModuleLoaded("test");
      
      return (
        <div>
          <div data-testid="module-result">{testModule ? "found" : "null"}</div>
          <div data-testid="api-result">{api ? "found" : "null"}</div>
          <div data-testid="loaded-result">{isLoaded.toString()}</div>
        </div>
      );
    }

    expect(() => render(<TestSafeFallback />)).not.toThrow();
    
    expect(screen.getByTestId("module-result")).toHaveTextContent("null");
    expect(screen.getByTestId("api-result")).toHaveTextContent("null");
    expect(screen.getByTestId("loaded-result")).toHaveTextContent("false");
  });
});
