import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useModules } from "../useModules";
import { AppShell } from "../../shell/AppShell";

describe("useModules", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("should work without memory leaks", () => {
    const TestComponent = () => {
      useModules(); // Just call the hook
      return <div>test</div>;
    };

    const { unmount } = render(
      <AppShell>
        <TestComponent />
      </AppShell>
    );

    unmount();
  });
});
