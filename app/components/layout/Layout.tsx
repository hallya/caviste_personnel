import { CartProvider } from "../../contexts/CartContext";
import { NotificationProvider } from "../../contexts/NotificationContext";
import CartFloatingButton from "../cart/CartFloatingButton";
import { SpeedInsights } from "@vercel/speed-insights/next";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <CartProvider>
      <NotificationProvider>
        {children}
        <CartFloatingButton />
        <SpeedInsights />
      </NotificationProvider>
    </CartProvider>
  );
}
