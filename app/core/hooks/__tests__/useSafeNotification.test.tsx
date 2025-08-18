import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSafeNotification } from "../useSafeNotification";
import { NotificationProvider } from "../../../contexts/NotificationContext";

function TestComponent() {
  const notification = useSafeNotification();
  
  return (
    <div>
      <div data-testid="show-available">{typeof notification.showNotification}</div>
      <div data-testid="hide-available">{typeof notification.hideNotification}</div>
      <div data-testid="hide-group-available">{typeof notification.hideNotificationGroup}</div>
    </div>
  );
}

describe("useSafeNotification", () => {
  it("provides safe fallback when used outside NotificationProvider", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("show-available")).toHaveTextContent("function");
    expect(screen.getByTestId("hide-available")).toHaveTextContent("function");
    expect(screen.getByTestId("hide-group-available")).toHaveTextContent("function");
  });

  it("returns actual context when used within NotificationProvider", () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    expect(screen.getByTestId("show-available")).toHaveTextContent("function");
    expect(screen.getByTestId("hide-available")).toHaveTextContent("function");
    expect(screen.getByTestId("hide-group-available")).toHaveTextContent("function");
  });

  it("safe fallback methods do not throw errors", () => {
    function TestSafeFallback() {
      const notification = useSafeNotification();
      

      notification.showNotification({ type: "success", title: "Test", message: "Test message" });
      notification.hideNotification("test-id");
      notification.hideNotificationGroup("test-group");
      
      return <div data-testid="no-error">No errors</div>;
    }

    expect(() => render(<TestSafeFallback />)).not.toThrow();
    expect(screen.getByTestId("no-error")).toBeInTheDocument();
  });
});
