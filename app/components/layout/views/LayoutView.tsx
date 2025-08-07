import CartFloatingButton from "../../cart/CartFloatingButton";

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
          {children}
        </NotificationProvider>
        <CartFloatingButton />
      </body>
    </html>
  );
} 