import CartFloatingButton from "../../cart/CartFloatingButton";
import { CartProvider } from "../../../contexts/CartContext";

interface LayoutViewProps {
  children: React.ReactNode;
  fontClasses: string;
  NotificationProvider: React.ComponentType<{ children: React.ReactNode }>;
}

export default function LayoutView({ 
  children, 
  fontClasses, 
  NotificationProvider 
}: LayoutViewProps) {
  return (
    <html lang="en">
      <body className={fontClasses}>
        <NotificationProvider>
          <CartProvider>
            {children}
            <CartFloatingButton />
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  );
} 