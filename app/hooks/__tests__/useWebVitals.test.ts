/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useWebVitals } from "../useWebVitals";

const mockOnCLS = jest.fn();
const mockOnFCP = jest.fn();
const mockOnLCP = jest.fn();
const mockOnTTFB = jest.fn();
const mockOnINP = jest.fn();

jest.mock("web-vitals", () => ({
  onCLS: mockOnCLS,
  onFCP: mockOnFCP,
  onLCP: mockOnLCP,
  onTTFB: mockOnTTFB,
  onINP: mockOnINP,
}));

global.fetch = jest.fn();

global.Response = class MockResponse {
  constructor(private data: string) {}
  json() {
    return Promise.resolve(JSON.parse(this.data));
  }
} as unknown as typeof Response;

const mockConsentIsGranted = jest.fn();
const mockConsentOnChange = jest.fn();
jest.mock("../../utils/consent", () => ({
  consent: {
    isGranted: mockConsentIsGranted,
    onChange: mockConsentOnChange,
  },
}));

describe("useWebVitals", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsentIsGranted.mockReturnValue(false);
    mockConsentOnChange.mockReturnValue(() => {});
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it("should initialize with default config", () => {
    const { result } = renderHook(() => useWebVitals());

    expect(result.current.pendingCount).toBe(0);
    expect(result.current.isTracking).toBe(false);
  });

  it("should not start tracking when consent is not granted", () => {
    mockConsentIsGranted.mockReturnValue(false);

    renderHook(() => useWebVitals());

    expect(mockOnCLS).not.toHaveBeenCalled();
    expect(mockOnFCP).not.toHaveBeenCalled();
  });

  it("should start tracking when consent is granted", async () => {
    mockConsentIsGranted.mockReturnValue(true);

    const { result } = renderHook(() => useWebVitals());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockOnCLS).toHaveBeenCalled();
    expect(mockOnFCP).toHaveBeenCalled();
    expect(result.current.isTracking).toBe(true);
  });

  it("should handle consent changes", async () => {
    mockConsentIsGranted.mockReturnValue(false);

    let consentCallback: ((status: string) => void) | undefined;
    mockConsentOnChange.mockImplementation((callback) => {
      consentCallback = callback;
      return () => {};
    });

    const { result } = renderHook(() => useWebVitals());

    expect(result.current.isTracking).toBe(false);

    await act(async () => {
      if (consentCallback) {
        consentCallback("granted");
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockOnCLS).toHaveBeenCalled();
    expect(result.current.isTracking).toBe(true);
  });

  it("should flush metrics when consent is denied", async () => {
    mockConsentIsGranted.mockReturnValue(true);

    let consentCallback: ((status: string) => void) | undefined;
    mockConsentOnChange.mockImplementation((callback) => {
      consentCallback = callback;
      return () => {};
    });

    const { result } = renderHook(() => useWebVitals());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isTracking).toBe(true);

    await act(async () => {
      if (consentCallback) {
        consentCallback("denied");
      }
    });

    expect(result.current.isTracking).toBe(false);
  });

  it("should respect flushOnPageChange option", () => {
    const mockAddEventListener = jest.spyOn(window, "addEventListener");
    const mockDocumentAddEventListener = jest.spyOn(
      document,
      "addEventListener"
    );

    renderHook(() => useWebVitals({ flushOnPageChange: false }));

    expect(mockAddEventListener).not.toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
    expect(mockDocumentAddEventListener).not.toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function)
    );

    mockAddEventListener.mockRestore();
    mockDocumentAddEventListener.mockRestore();
  });

  it("should handle web-vitals import errors gracefully", async () => {
    mockConsentIsGranted.mockReturnValue(true);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await jest.isolateModules(async () => {
      // Mock the dynamic import to fail
      jest.doMock(
        "web-vitals",
        () => {
          throw new Error("Module not found");
        },
        { virtual: true }
      );

      const { useWebVitals: isolatedUseWebVitals } = await import(
        "../useWebVitals"
      );

      renderHook(() => isolatedUseWebVitals({ debug: true }));

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "❌ Failed to load web-vitals:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
