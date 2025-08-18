import { AppShell } from "../../core/shell/AppShell";
import { RouteRegistry } from "../../core/routing/RouteRegistry";
import { CartModule } from "../../modules/cart";
import { NotificationModule } from "../../modules/notifications";
import { CartProvider } from "../../contexts/CartContext";
import { NotificationProvider } from "../../contexts/NotificationContext";
import CartFloatingButton from "../cart/CartFloatingButton";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AppShell>
      <RouteRegistry>
        <CartProvider>
          <NotificationProvider>
            <NotificationModule>
              <CartModule>
                {children}
                <CartFloatingButton />
              </CartModule>
            </NotificationModule>
          </NotificationProvider>
        </CartProvider>
      </RouteRegistry>
    </AppShell>
  );
}
