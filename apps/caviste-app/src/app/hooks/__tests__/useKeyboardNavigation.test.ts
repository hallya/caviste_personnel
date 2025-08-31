import { renderHook, act } from "@testing-library/react";
import { useKeyboardNavigation } from "../useKeyboardNavigation";

describe("useKeyboardNavigation", () => {
  const mockOnEscape = jest.fn();
  const mockOnEnter = jest.fn();
  const mockOnSpace = jest.fn();
  const mockOnArrowUp = jest.fn();
  const mockOnArrowDown = jest.fn();
  const mockOnArrowLeft = jest.fn();
  const mockOnArrowRight = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides handleKeyDown function", () => {
    const { result } = renderHook(() => useKeyboardNavigation());

    expect(result.current.handleKeyDown).toBeDefined();
  });

  it("calls onEscape when Escape key is pressed", () => {
    renderHook(() => useKeyboardNavigation({ onEscape: mockOnEscape }));

    const event = new KeyboardEvent("keydown", { key: "Escape" });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(mockOnEscape).toHaveBeenCalledTimes(1);
  });

  it("calls onEnter when Enter key is pressed", () => {
    renderHook(() => useKeyboardNavigation({ onEnter: mockOnEnter }));

    const event = new KeyboardEvent("keydown", { key: "Enter" });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(mockOnEnter).toHaveBeenCalledTimes(1);
  });

  it("calls onSpace when Space key is pressed", () => {
    renderHook(() => useKeyboardNavigation({ onSpace: mockOnSpace }));

    const event = new KeyboardEvent("keydown", { key: " " });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(mockOnSpace).toHaveBeenCalledTimes(1);
  });

  it("calls onArrowUp when ArrowUp key is pressed", () => {
    renderHook(() => useKeyboardNavigation({ onArrowUp: mockOnArrowUp }));

    const event = new KeyboardEvent("keydown", { key: "ArrowUp" });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(mockOnArrowUp).toHaveBeenCalledTimes(1);
  });

  it("calls onArrowDown when ArrowDown key is pressed", () => {
    renderHook(() => useKeyboardNavigation({ onArrowDown: mockOnArrowDown }));

    const event = new KeyboardEvent("keydown", { key: "ArrowDown" });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(mockOnArrowDown).toHaveBeenCalledTimes(1);
  });

  it("calls onArrowLeft when ArrowLeft key is pressed", () => {
    renderHook(() => useKeyboardNavigation({ onArrowLeft: mockOnArrowLeft }));

    const event = new KeyboardEvent("keydown", { key: "ArrowLeft" });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(mockOnArrowLeft).toHaveBeenCalledTimes(1);
  });

  it("calls onArrowRight when ArrowRight key is pressed", () => {
    renderHook(() => useKeyboardNavigation({ onArrowRight: mockOnArrowRight }));

    const event = new KeyboardEvent("keydown", { key: "ArrowRight" });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(mockOnArrowRight).toHaveBeenCalledTimes(1);
  });

  it("does not call handlers when disabled", () => {
    renderHook(() =>
      useKeyboardNavigation({
        onEscape: mockOnEscape,
        enabled: false,
      }),
    );

    const event = new KeyboardEvent("keydown", { key: "Escape" });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(mockOnEscape).not.toHaveBeenCalled();
  });

  it("prevents default behavior for handled keys", () => {
    renderHook(() => useKeyboardNavigation({ onEscape: mockOnEscape }));

    const event = new KeyboardEvent("keydown", { key: "Escape" });
    const preventDefaultSpy = jest.spyOn(event, "preventDefault");

    act(() => {
      document.dispatchEvent(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("does not prevent default for unhandled keys", () => {
    renderHook(() => useKeyboardNavigation());

    const event = new KeyboardEvent("keydown", { key: "A" });
    const preventDefaultSpy = jest.spyOn(event, "preventDefault");

    act(() => {
      document.dispatchEvent(event);
    });

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});
