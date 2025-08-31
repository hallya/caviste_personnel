import { useEffect, useMemo, useRef } from "react";

export function useDebounce<TArgs extends readonly unknown[], TReturn>(
  callback: (...args: TArgs) => TReturn,
  delay: number,
): (...args: TArgs) => void {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    return (...args: TArgs) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    };
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}
