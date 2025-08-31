import { useState, useCallback } from "react";

export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(null), 1000);
  }, []);

  return { announcement, announce };
}
