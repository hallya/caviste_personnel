"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CAROUSEL_CONFIG } from "./constants";
import type { CarouselOptions, CarouselReturn } from "./types";
import { useDeviceDetection } from "./hooks/useDeviceDetection";

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export function useCarouselNav(totalItems: number, opts?: CarouselOptions): CarouselReturn {
  const [current, setCurrent] = useState(() => {
    if (totalItems <= 0) return 0;
    if (opts?.initial === "center") return Math.floor(totalItems / 2);
    if (typeof opts?.initial === "number") return clamp(opts.initial, 0, totalItems - 1);
    return 0;
  });

  const isMobile = useDeviceDetection();

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  useEffect(() => {
    if (totalItems <= 0) {
      setCurrent(0);
      return;
    }
    
    if (opts?.initial === "center") {
      setCurrent(Math.floor(totalItems / 2));
    } else {
      setCurrent(prev => clamp(prev, 0, totalItems - 1));
    }
  }, [totalItems, opts?.initial]);

  const navigateTo = useCallback((index: number) => {
    if (totalItems <= 0) return;
    
    const nextIndex = clamp(index, 0, totalItems - 1);
    if (nextIndex !== current) {
      setCurrent(nextIndex);
    }
  }, [current, totalItems]);

  const goStep = useCallback((direction: 1 | -1) => {
    if (totalItems <= 1) return;
    navigateTo(current + direction);
  }, [current, totalItems, navigateTo]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (isMobile) return;
    
    e.preventDefault();
    if (scrollTimeout.current) return;
    
    const deltaX = e.deltaX;
    const deltaY = e.deltaY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      goStep(deltaX > 0 ? 1 : -1);
    } else {
      goStep(deltaY > 0 ? 1 : -1);
    }
    
    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null;
    }, CAROUSEL_CONFIG.WHEEL_DEBOUNCE);
  }, [goStep, isMobile]);

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowRight") goStep(1);
    if (e.key === "ArrowLeft") goStep(-1);
  }, [goStep]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    const time = Date.now() - touchStartTime.current;
    const velocity = Math.abs(delta / time);
    
    if (velocity > CAROUSEL_CONFIG.SWIPE_VELOCITY_THRESHOLD || Math.abs(delta) > CAROUSEL_CONFIG.SWIPE_THRESHOLD) {
      goStep(delta > 0 ? 1 : -1);
    }
    
    touchStartX.current = null;
  }, [goStep]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    
    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  return {
    current,
    isMobile,
    containerRef,
    goStep,
    handleTouchStart,
    handleTouchEnd,
    setCurrent: navigateTo,
  };
}
