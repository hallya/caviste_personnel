import { useCallback } from "react";
import { AnalyticsEvent } from "../types";

export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent) => {
    if (
      process.env.NODE_ENV === "production" ||
      process.env.VERCEL_ENV === "preview" ||
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true"
    ) {
      try {
        import("@vercel/analytics")
          .then(({ track: vercelTrack }) => {
            vercelTrack(event.name, event.properties);
          })
          .catch(() => {});
      } catch (error) {
        console.error("Erreur lors du tracking:", error);
      }
    }
  }, []);

  return { track };
}
