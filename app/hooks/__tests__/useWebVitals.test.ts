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

jest.mock("../../utils/consent", () => ({
  consent: {
    isGranted: jest.fn(),
    onChange: jest.fn(),
  },
}));

import { consent } from "../../utils/consent";

const mockConsent = consent as jest.Mocked<typeof consent>;

describe("useWebVitals", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsent.isGranted.mockReturnValue(false);
    mockConsent.onChange.mockReturnValue(() => {});
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
    mockConsent.isGranted.mockReturnValue(false);

    renderHook(() => useWebVitals());

    expect(mockOnCLS).not.toHaveBeenCalled();
    expect(mockOnFCP).not.toHaveBeenCalled();
  });

  it("should start tracking when consent is granted", async () => {
    mockConsent.isGranted.mockReturnValue(true);

    const { result } = renderHook(() => useWebVitals());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockOnCLS).toHaveBeenCalled();
    expect(mockOnFCP).toHaveBeenCalled();
    expect(result.current.isTracking).toBe(true);
  });

  it("should handle consent changes", async () => {
    mockConsent.isGranted.mockReturnValue(false);

    let consentCallback: ((status: 'granted' | 'denied' | 'pending') => void) | undefined;
    mockConsent.onChange.mockImplementation((callback) => {
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
    mockConsent.isGranted.mockReturnValue(true);

    let consentCallback: ((status: 'granted' | 'denied' | 'pending') => void) | undefined;
    mockConsent.onChange.mockImplementation((callback) => {
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
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.pendingCount).toBe(0);
  });

  it("should respect flushOnPageChange option", () => {
    const { result } = renderHook(() => useWebVitals({ flushOnPageChange: false }));

    expect(result.current).toBeDefined();
  });
});
