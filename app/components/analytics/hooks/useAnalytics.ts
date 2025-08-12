import { useCallback } from 'react';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean | null>;
}

export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent) => {
    // Track in production, preview environments, or when explicitly enabled
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.VERCEL_ENV === 'preview' ||
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
    ) {
      try {
        // Dynamic import to avoid SSR issues
        import('@vercel/analytics').then(({ track: vercelTrack }) => {
          vercelTrack(event.name, event.properties);
        }).catch(() => {
          // Silently fail if analytics is not available
        });
      } catch {
        // Silently fail if analytics is not available
      }
    }
  }, []);

  return { track };
}
