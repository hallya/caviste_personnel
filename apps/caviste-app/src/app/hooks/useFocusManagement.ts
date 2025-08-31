import { useRef, useCallback } from "react";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useFocusManagement() {
  const focusRef = useRef<HTMLElement>(null);

  const focusElement = useCallback(() => {
    focusRef.current?.focus();
  }, []);

  const focusFirstFocusable = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(FOCUSABLE_SELECTOR);
    const firstElement = focusableElements[0] as HTMLElement;
    firstElement?.focus();
  }, []);

  const focusLastFocusable = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(FOCUSABLE_SELECTOR);
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;
    lastElement?.focus();
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = Array.from(
      container.querySelectorAll(FOCUSABLE_SELECTOR),
    ) as HTMLElement[];

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    focusRef,
    focusElement,
    focusFirstFocusable,
    focusLastFocusable,
    trapFocus,
  };
}
