import { renderHook, act } from '@testing-library/react';
import { useCarouselNav } from '../useCarouselNav';

const mockWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe('useCarouselNav', () => {
  beforeEach(() => {
    mockWindowWidth(1024);
  });

  describe('initialization', () => {
    it('initializes with center option for odd number of items', () => {
      const { result } = renderHook(() => useCarouselNav(5, { initial: 'center' }));
      expect(result.current.current).toBe(2);
    });

    it('initializes with center option for even number of items', () => {
      const { result } = renderHook(() => useCarouselNav(4, { initial: 'center' }));
      expect(result.current.current).toBe(2);
    });

    it('initializes with specific index', () => {
      const { result } = renderHook(() => useCarouselNav(5, { initial: 3 }));
      expect(result.current.current).toBe(3);
    });

    it('initializes with 0 when no options provided', () => {
      const { result } = renderHook(() => useCarouselNav(5));
      expect(result.current.current).toBe(0);
    });

    it('handles empty collection', () => {
      const { result } = renderHook(() => useCarouselNav(0));
      expect(result.current.current).toBe(0);
    });
  });

  describe('navigation', () => {
    it('moves to next item', () => {
      const { result } = renderHook(() => useCarouselNav(5, { initial: 0 }));
      
      act(() => {
        result.current.goStep(1);
      });
      
      expect(result.current.current).toBe(1);
    });

    it('moves to previous item', () => {
      const { result } = renderHook(() => useCarouselNav(5, { initial: 2 }));
      
      act(() => {
        result.current.goStep(-1);
      });
      
      expect(result.current.current).toBe(1);
    });

    it('stops at first item when going backwards', () => {
      const { result } = renderHook(() => useCarouselNav(5, { initial: 0 }));
      
      act(() => {
        result.current.goStep(-1);
      });
      
      expect(result.current.current).toBe(0);
    });

    it('stops at last item when going forwards', () => {
      const { result } = renderHook(() => useCarouselNav(5, { initial: 4 }));
      
      act(() => {
        result.current.goStep(1);
      });
      
      expect(result.current.current).toBe(4);
    });
  });

  describe('device detection', () => {
    it('detects mobile device', () => {
      mockWindowWidth(375);
      const { result } = renderHook(() => useCarouselNav(5));
      expect(result.current.isMobile).toBe(true);
    });

    it('detects desktop device', () => {
      mockWindowWidth(1024);
      const { result } = renderHook(() => useCarouselNav(5));
      expect(result.current.isMobile).toBe(false);
    });
  });

  describe('refs', () => {
    it('provides container ref', () => {
      const { result } = renderHook(() => useCarouselNav(5));
      expect(result.current.containerRef).toBeDefined();
      expect(result.current.containerRef.current).toBeNull();
    });
  });
}); 