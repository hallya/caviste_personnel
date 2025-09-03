"use client";

import { AppShell, RouteRegistry } from "@pkg/core";
import { NotificationProvider } from "@pkg/notifications";
import { CartFloatingButton } from "@pkg/cart";
import { AnalyticsProvider } from "@pkg/analytics";

interface LayoutProps {
  children: React.ReactNode;
}

function LayoutWrapper({ children }: LayoutProps) {
  return (
    <AnalyticsProvider>
      <AppShell>
        <RouteRegistry>
            <NotificationProvider>
              {children}
              <CartFloatingButton />
            </NotificationProvider>
        </RouteRegistry>
      </AppShell>
    </AnalyticsProvider>
  );
}

export default function Layout({ children }: LayoutProps) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
