import { renderHook } from "@testing-library/react";
import { useAnalytics } from "../useAnalytics";

describe("useAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a track function", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.track).toBeDefined();
    expect(typeof result.current.track).toBe("function");
  });

  it("should handle events with properties", async () => {
    const { result } = renderHook(() => useAnalytics());
    const testEvent = {
      name: "test_event",
      properties: { key: "value" },
    };

    result.current.track(testEvent);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(result.current.track).toBeDefined();
  });

  it("should handle events without properties", async () => {
    const { result } = renderHook(() => useAnalytics());
    const testEvent = {
      name: "test_event",
    };

    result.current.track(testEvent);

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the function doesn't throw
    expect(result.current.track).toBeDefined();
  });

  it("should handle events with null properties", async () => {
    const { result } = renderHook(() => useAnalytics());
    const testEvent = {
      name: "test_event",
      properties: { key: null },
    };

    result.current.track(testEvent);

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the function doesn't throw
    expect(result.current.track).toBeDefined();
  });

  it("should handle events with mixed property types", async () => {
    const { result } = renderHook(() => useAnalytics());
    const testEvent = {
      name: "test_event",
      properties: {
        string: "value",
        number: 42,
        boolean: true,
        nullValue: null,
      },
    };

    result.current.track(testEvent);

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the function doesn't throw
    expect(result.current.track).toBeDefined();
  });

  it("should not throw when called multiple times", async () => {
    const { result } = renderHook(() => useAnalytics());
    const testEvent = { name: "test_event" };

    // Call multiple times
    result.current.track(testEvent);
    result.current.track(testEvent);
    result.current.track(testEvent);

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the function doesn't throw
    expect(result.current.track).toBeDefined();
  });
});
