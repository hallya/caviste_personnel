/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('should debounce function calls', () => {
    const mockFn = jest.fn();
    const { result } = renderHook(() => useDebounce(mockFn, 250));

    act(() => {
      result.current('first call');
      result.current('second call');
      result.current('third call');
    });

    expect(mockFn).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(249);
    });

    expect(mockFn).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third call');
  });

  it('should cancel previous timeout when called again', () => {
    const mockFn = jest.fn();
    const { result } = renderHook(() => useDebounce(mockFn, 250));

    act(() => {
      result.current('first call');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      result.current('second call');
    });

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('second call');
  });

  it('should prevent memory leaks by cleaning up timeout on unmount', () => {
    const mockFn = jest.fn();
    const { result, unmount } = renderHook(() => useDebounce(mockFn, 250));

    act(() => {
      result.current('test call');
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should update callback reference', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    
    const { result, rerender } = renderHook(
      ({ callback }) => useDebounce(callback, 250),
      { initialProps: { callback: mockFn1 } }
    );

    act(() => {
      result.current('test call');
    });

    rerender({ callback: mockFn2 });

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalledWith('test call');
  });
});