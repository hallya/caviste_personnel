import { renderHook, act } from "@testing-library/react";
import { useAnnouncement } from "../useAnnouncement";

describe("useAnnouncement", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("provides announcement state and announce function", () => {
    const { result } = renderHook(() => useAnnouncement());

    expect(result.current.announcement).toBeNull();
    expect(typeof result.current.announce).toBe("function");
  });

  it("sets announcement when announce is called", () => {
    const { result } = renderHook(() => useAnnouncement());

    act(() => {
      result.current.announce("Test announcement");
    });

    expect(result.current.announcement).toBe("Test announcement");
  });

  it("clears announcement after timeout", () => {
    const { result } = renderHook(() => useAnnouncement());

    act(() => {
      result.current.announce("Test announcement");
    });

    expect(result.current.announcement).toBe("Test announcement");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.announcement).toBeNull();
  });

  it("replaces existing announcement when announce is called again", () => {
    const { result } = renderHook(() => useAnnouncement());

    act(() => {
      result.current.announce("First announcement");
    });

    expect(result.current.announcement).toBe("First announcement");

    act(() => {
      result.current.announce("Second announcement");
    });

    expect(result.current.announcement).toBe("Second announcement");
  });

  it("resets timeout when announce is called multiple times", () => {
    const { result } = renderHook(() => useAnnouncement());

    act(() => {
      result.current.announce("First announcement");
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      result.current.announce("Second announcement");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.announcement).toBe("Second announcement");

    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(result.current.announcement).toBeNull();
  });
});
