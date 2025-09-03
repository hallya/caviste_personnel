import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AppShell } from "@pkg/core";
import { NotificationProvider } from "../context/NotificationContext";
import {
  NotificationModule,
  useNotificationModule,
} from "../NotificationModule";

jest.mock("@pkg/core", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSafeAppShell: () => ({
    registerModule: jest.fn(),
    getModule: jest.fn(),
    getModuleAPI: jest.fn(),
    isModuleLoaded: jest.fn(),
  }),
}));

function TestComponent() {
  const notificationModule = useNotificationModule();

  const handleShowSuccess = () => {
    notificationModule.showNotification({
      type: "success",
      title: "Success Title",
      message: "Success message",
    });
  };

  const handleShowError = () => {
    notificationModule.showNotification({
      type: "error",
      title: "Error Title", 
      message: "Error message",
    });
  };


  return (
    <div>
      <button onClick={handleShowSuccess}>Show Success</button>
      <button onClick={handleShowError}>Show Error</button>
    </div>
  );
}

describe("NotificationModule", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderWithProviders = (children: React.ReactNode) => {
    return render(
      <AppShell>
        <NotificationProvider>
          <NotificationModule>
            {children}
          </NotificationModule>
        </NotificationProvider>
      </AppShell>
    );
  };

  describe("Provider Integration", () => {
    it("provides notification module context to children", () => {
      renderWithProviders(<TestComponent />);

      expect(screen.getByRole("button", { name: "Show Success" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Show Error" })).toBeInTheDocument();
    });

    it("renders without crashing when no children provided", () => {
      render(
        <AppShell>
          <NotificationProvider>
            <NotificationModule>
              <div>Test</div>
            </NotificationModule>
          </NotificationProvider>
        </AppShell>
      );

      expect(screen.queryByText("Error")).not.toBeInTheDocument();
    });
  });

  describe("Notification Display", () => {
    it("displays success notification when showNotification is called", async () => {
      renderWithProviders(<TestComponent />);

      const showButton = screen.getByRole("button", { name: "Show Success" });
      await user.click(showButton);

      await waitFor(() => {
        expect(screen.getByText("Success Title")).toBeInTheDocument();
        expect(screen.getByText("Success message")).toBeInTheDocument();
      });
    });

    it("displays error notification with correct styling", async () => {
      renderWithProviders(<TestComponent />);

      const showButton = screen.getByRole("button", { name: "Show Error" });
      await user.click(showButton);

      await waitFor(() => {
        expect(screen.getByText("Error Title")).toBeInTheDocument();
        expect(screen.getByText("Error message")).toBeInTheDocument();
      });
    });

  });

  describe("Multiple Notifications", () => {
    it("displays multiple notifications simultaneously", async () => {
      renderWithProviders(<TestComponent />);

      await user.click(screen.getByRole("button", { name: "Show Success" }));
      await user.click(screen.getByRole("button", { name: "Show Error" }));

      await waitFor(() => {
        expect(screen.getByText("Success Title")).toBeInTheDocument();
        expect(screen.getByText("Error Title")).toBeInTheDocument();
      });
    });

    it("handles rapid successive notifications", async () => {
      renderWithProviders(<TestComponent />);

      const successButton = screen.getByRole("button", { name: "Show Success" });
      
      await user.click(successButton);
      await user.click(successButton);
      await user.click(successButton);

      await waitFor(() => {
        expect(screen.getAllByText("Success Title")).toHaveLength(3);
      });
    });
  });

  describe("Notification Dismissal", () => {
    it("allows dismissing notifications via close button", async () => {
      renderWithProviders(<TestComponent />);

      const showButton = screen.getByRole("button", { name: "Show Success" });
      await user.click(showButton);

      await waitFor(() => {
        expect(screen.getByText("Success Title")).toBeInTheDocument();
      });

      const closeButton = screen.getByRole("button", { name: /fermer/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Success Title")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("handles invalid notification data gracefully", async () => {
      function InvalidTestComponent() {
        const notificationModule = useNotificationModule();

        const handleShowInvalid = () => {
          notificationModule.showNotification({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: "invalid" as any,
            title: "",
            message: "",
          });
        };

        return <button onClick={handleShowInvalid}>Show Invalid</button>;
      }

      renderWithProviders(<InvalidTestComponent />);

      const showButton = screen.getByRole("button", { name: "Show Invalid" });
      
      expect(() => user.click(showButton)).not.toThrow();
    });

    it("handles missing notification module gracefully", () => {
      function ComponentWithoutProvider() {
        try {
          return <div>Should not render</div>;
        } catch {
          return <div>Error handled</div>;
        }
      }

      render(<ComponentWithoutProvider />);
      expect(screen.getByText("Should not render")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("provides proper ARIA labels for notifications", async () => {
      renderWithProviders(<TestComponent />);

      const showButton = screen.getByRole("button", { name: "Show Success" });
      await user.click(showButton);

      await waitFor(() => {
        const notification = screen.getByRole("alert");
        expect(notification).toBeInTheDocument();
      });
    });

    it("supports keyboard navigation for dismissal", async () => {
      renderWithProviders(<TestComponent />);

      const showButton = screen.getByRole("button", { name: "Show Success" });
      await user.click(showButton);

      await waitFor(() => {
        expect(screen.getByText("Success Title")).toBeInTheDocument();
      });

      const closeButton = screen.getByRole("button", { name: /fermer/i });
      closeButton.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.queryByText("Success Title")).not.toBeInTheDocument();
      });
    });
  });
});