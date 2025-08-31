"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const AnalyticsContext = createContext<null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  return (
    <AnalyticsContext.Provider value={null}>
      {children}
      <SpeedInsights />
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalyticsContext must be used within AnalyticsProvider");
  }
  return context;
};
